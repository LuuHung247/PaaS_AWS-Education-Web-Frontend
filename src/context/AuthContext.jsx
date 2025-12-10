import { createContext, useContext, useState, useEffect } from 'react';
import {
    signIn as amplifySignIn, signUp as amplifySignUp, confirmSignUp as amplifyConfirmSignUp,
    signOut as amplifySignOut, resetPassword, confirmResetPassword,
    updatePassword,
    resendSignUpCode as amplifyResendSignUpCode,
    signInWithRedirect, 
    getCurrentUser, 
    fetchAuthSession,
    fetchUserAttributes
} from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import axios from 'axios';
// eslint-disable-next-line no-unused-vars
import { createUserProfile, getCurrentUserProfile } from '../services/UserService';

// Create Authentication Context
const AuthContext = createContext();

// Export AuthContext so components can import and use it
export { AuthContext };

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const syncUserToBackend = async (additionalData = {}) => {
        try {
            // 1. Lấy session hiện tại
            const session = await fetchAuthSession();
            
            // 2. Kiểm tra ID Token
            if (!session.tokens?.idToken) {
                return null;
            }

            const idTokenObj = session.tokens.idToken;
            const tokenString = idTokenObj.toString();
            const payloadData = idTokenObj.payload;

            console.log("ID Token Payload:", payloadData);

            const payload = {
                cognito_sub: payloadData.sub,
                email: additionalData.email || payloadData.email,                
                name: additionalData.name || payloadData.name || payloadData.given_name || payloadData['cognito:username'],                
                gender: additionalData.gender || payloadData.gender,
                birthdate: additionalData.birthdate || payloadData.birthdate,
                avatar: additionalData.avatar || payloadData.picture,
            };

            const response = await axios.post('http://localhost:5001/api/v1/users/sync', payload, {
                headers: {
                    'Authorization': `Bearer ${tokenString}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log("Sync User Success:", response.data);
            return response.data;
        } catch (err) {
            console.error("Failed to sync user to backend:", err);
            return null;
        }
    };

    // Check if user is already authenticated
    useEffect(() => {
        const checkAuthState = async () => {
            try {
                await getCurrentUser();
                const syncedData = await syncUserToBackend();
                if (syncedData) {
                    setUser(syncedData); 
                } else {
                    const userData = await getCurrentUserProfile();
                    setUser(userData);
                }

            // eslint-disable-next-line no-unused-vars
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuthState();
    }, []);

    // Listen for auth events (token expiration, etc.)
    useEffect(() => {
        const unsubscribe = Hub.listen('auth', ({ payload }) => {
            switch (payload.event) {
                case 'signIn':
                case 'signInWithRedirect':
                    setLoading(true);
                    syncUserToBackend()
                        .then((userData) => {
                             if(userData) setUser(userData);
                             else getCurrentUserProfile().then(setUser);
                        })
                        .catch(err => console.error("Post-login sync failed", err))
                        .finally(() => setLoading(false));
                    break;

                case 'tokenRefresh_failure':
                case 'signOut':
                    setUser(null);
                    localStorage.clear();
                    break;
            }
        });

        return unsubscribe;
    }, []);
    
    const googleSignIn = async () => {
        setLoading(true);
        setError(null);
        try {
            await signInWithRedirect({ provider: 'Google' });
        } catch (err) {
            setError(err.message || 'Failed to sign in with Google');
            setLoading(false);
            throw err;
        }
    };

    // Sign in function
    const signIn = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const { isSignedIn, nextStep } = await amplifySignIn({ username: email, password });
            
            if (isSignedIn) {
                const tempAttributesStr = sessionStorage.getItem(`temp_attributes_${email}`);
                const tempAttributes = tempAttributesStr ? JSON.parse(tempAttributesStr) : {};
                try {
                    const userData = await syncUserToBackend(tempAttributes);
                    setUser(userData);

                    sessionStorage.removeItem(`temp_attributes_${email}`);
                } catch (profileErr) {
                    console.log("Sync error after login:", profileErr)
                }
            }
            return { isSignedIn, nextStep };
        } catch (err) {
            setError(err.message || 'Failed to sign in');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Sign up function
    const signUp = async (email, password, attributes = {}) => {
        setLoading(true);
        setError(null);
        try {
            const username = email.replace(/[@.]/g, '-');
            // Format the birthdate as required by Cognito (ISO format)
            let userAttributes = { 
                ...attributes, 
                email: email 
            };

            // Handle the cognito required attributes
            if (attributes.birthdate) {
                userAttributes['birthdate'] = attributes.birthdate;
            }

            if (attributes.gender) {
                userAttributes['gender'] = attributes.gender;
            }

            const result = await amplifySignUp({
                username: username,
                password,
                options: {
                    userAttributes
                }
            });
            // Tạo profile trong MongoDB ngay sau khi đăng ký
            // await createUserProfile({
            //     userId: result.userId || email.replace(/[@.]/g, '-'),
            //     email: email,
            //     name: userAttributes.name || email.split('@')[0],
            //     gender: userAttributes.gender || '',
            //     birthdate: userAttributes.birthdate || ''
            // });

            // Store password and attributes temporarily for use during confirmation
            sessionStorage.setItem(`temp_password_${email}`, password);
            sessionStorage.setItem(`temp_attributes_${email}`, JSON.stringify(userAttributes));
            // sessionStorage.setItem(`temp_password_${email}`, password);
            // sessionStorage.setItem(`temp_attributes_${email}`, JSON.stringify(userAttributes));
            return result;
        } catch (err) {
            setError(err.message || 'Failed to sign up');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Confirm sign up function
    const confirmSignUp = async (email, code) => {
        setLoading(true);
        setError(null);
        try {
            // Confirm the signup with Cognito
            const result = await amplifyConfirmSignUp({
                username: email,
                confirmationCode: code
            });

            // Clean up stored data
            sessionStorage.removeItem(`temp_password_${email}`);
            sessionStorage.removeItem(`temp_attributes_${email}`);

            return result;
        } catch (err) {
            try {
                const username = email.replace(/[@.]/g, '-');
                const retryResult = await amplifyConfirmSignUp({
                    username: username,
                    confirmationCode: code
                });
                return retryResult;
            // eslint-disable-next-line no-unused-vars
            } catch (retryErr) {
                setError(err.message || 'Failed to confirm sign up');
                throw err;
            }
        } finally {
            setLoading(false);
        }
    };

    // Sign out function
    const signOut = async () => {
        setLoading(true);
        setError(null);
        try {
            await amplifySignOut();
            setUser(null);
        } catch (err) {
            setError(err.message || 'Failed to sign out');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Reset password function (previously forgotPassword)
    const forgotPassword = async (email) => {
        setLoading(true);
        setError(null);
        try {
            return await resetPassword({ username: email });
        } catch (err) {
            setError(err.message || 'Failed to initiate password reset');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Complete password reset function (previously forgotPasswordSubmit)
    const forgotPasswordSubmit = async (email, code, newPassword) => {
        setLoading(true);
        setError(null);
        try {
            return await confirmResetPassword({
                username: email,
                confirmationCode: code,
                newPassword
            });
        } catch (err) {
            setError(err.message || 'Failed to reset password');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Change password function
    const changePassword = async (oldPassword, newPassword) => {
        setLoading(true);
        setError(null);
        try {
            return await updatePassword({
                oldPassword,
                newPassword
            });
        } catch (err) {
            setError(err.message || 'Failed to change password');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Resend sign up verification code
    const resendSignUpCode = async (email) => {
        setLoading(true);
        setError(null);
        try {
            return await amplifyResendSignUpCode({
                username: email
            });
        } catch (err) {
            setError(err.message || 'Failed to resend verification code');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const value = {
        user,
        loading,
        error,
        signIn,
        signUp,
        confirmSignUp,
        signOut,
        forgotPassword,
        forgotPasswordSubmit,
        changePassword,
        resendSignUpCode,
        googleSignIn,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
