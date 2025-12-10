import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthCard from './AuthCard';
import FormInput from './FormInput';
import Button from './Button';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

// Debounce hook
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        birthdate: '',
        gender: 'male', // Default value
        password: '',
        confirmPassword: '',
    });
    const [tempErrors, setTempErrors] = useState({});
    const [formErrors, setFormErrors] = useState({});
    const [step, setStep] = useState(1); // 1: registration form, 2: confirmation code
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Debounce validation errors to give user time to type
    const debouncedErrors = useDebounce(tempErrors, 800);
    const [confirmationCode, setConfirmationCode] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { signUp, confirmSignUp, signIn, resendSignUpCode, googleSignIn, loading, error } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value,
        });

        // Clear errors when user starts typing
        if (formErrors[id]) {
            setFormErrors({
                ...formErrors,
                [id]: '',
            });
        }

        // Real-time validation for common fields - set to tempErrors first
        if (id === 'email' && value) {
            const emailRegex = /\S+@\S+\.\S+/;
            if (!emailRegex.test(value)) {
                setTempErrors(prev => ({
                    ...prev,
                    email: 'Please enter a valid email address'
                }));
            } else {
                setTempErrors(prev => ({
                    ...prev,
                    email: ''
                }));
            }
        }

        if (id === 'confirmPassword' && formData.password && value) {
            if (formData.password !== value) {
                setTempErrors(prev => ({
                    ...prev,
                    confirmPassword: 'Passwords do not match'
                }));
            } else {
                setTempErrors(prev => ({
                    ...prev,
                    confirmPassword: ''
                }));
            }
        }
    };

    // Update formErrors from debounced temp errors
    useEffect(() => {
        setFormErrors(prev => ({
            ...prev,
            ...debouncedErrors
        }));
    }, [debouncedErrors]);

    const validateForm = () => {
        let errors = {};
        let isValid = true;

        if (!formData.fullName) {
            errors.fullName = 'Full name is required';
            isValid = false;
        }

        if (!formData.email) {
            errors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email address is invalid';
            isValid = false;
        }

        if (!formData.birthdate) {
            errors.birthdate = 'Birth date is required';
            isValid = false;
        }

        if (!formData.gender) {
            errors.gender = 'Gender is required';
            isValid = false;
        }

        if (!formData.password) {
            errors.password = 'Password is required';
            isValid = false;
        } else if (formData.password.length < 8) {
            errors.password = 'Password must be at least 8 characters';
            isValid = false;
        }

        if (!formData.confirmPassword) {
            errors.confirmPassword = 'Please confirm your password';
            isValid = false;
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await signUp(formData.email, formData.password, {
                name: formData.fullName,
                birthdate: formData.birthdate,
                gender: formData.gender,
            });
            setIsTransitioning(true);
            setTimeout(() => {
                setStep(2);
                setIsTransitioning(false);
            }, 300);
        } catch (err) {
            throw err;
        }
    };

    const handleGoogleSignUp = async (e) => {
        e.preventDefault();
        try {
            await googleSignIn();
        } catch (err) {
            if (err.name === 'UserAlreadyAuthenticatedException' || err.message?.includes('already a signed in user')) {
                navigate('/');
            } else {
                console.error("Google sign-up failed", err);
            }
        }
    };

    const handleConfirmSubmit = async (e) => {
        e.preventDefault();

        if (!confirmationCode) {
            setFormErrors({
                ...formErrors,
                confirmationCode: 'Confirmation code is required',
            });
            return;
        }

        try {
            await confirmSignUp(formData.email, confirmationCode);
            try {
                 await signIn(formData.email, formData.password);
                 navigate('/'); 
            } catch (loginErr) {
                 console.error("Auto login failed", loginErr);
                 navigate('/login', {
                    state: {
                        message: 'Registration successful! Please sign in.'
                    }
                });
            }
        } catch (err) {
            throw Error(err);
        }
    };

    return (
        <AuthCard
            title={step === 1 ? "Create an account" : "Verify your email"}
            subtitle={step === 1
                ? "Get started with your AWS education account"
                : "We've sent a code to your email address"
            }
            isTransitioning={isTransitioning}
        >
            {error && (
                <div className="bg-red-50 text-red-800 p-4 rounded-md mb-4 animate-fadeIn animate-shake border-l-4 border-red-500">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="bg-green-50 text-green-800 p-4 rounded-md mb-4 animate-fadeIn border-l-4 border-green-500">
                    {successMessage}
                </div>
            )}

            {step === 1 ? (
                <form className="mt-8 space-y-6 animate-fadeIn focus-transition" onSubmit={handleSubmit}>
                    <FormInput
                        id="fullName"
                        label="Full Name"
                        type="text"
                        autoComplete="name"
                        required
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={handleChange}
                        error={formErrors.fullName}
                        autoFocus={true}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        }
                    />

                    <FormInput
                        id="email"
                        label="Email address"
                        type="email"
                        autoComplete="email"
                        required
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        error={formErrors.email}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                        }
                    />

                    <FormInput
                        id="birthdate"
                        label="Birth Date"
                        type="date"
                        required
                        value={formData.birthdate}
                        onChange={handleChange}
                        error={formErrors.birthdate}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                        }
                    />

                    <div className="mb-4">
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                            Gender <span className="text-red-500">*</span>
                        </label>
                        <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <select
                                id="gender"
                                name="gender"
                                className={`block w-full pl-10 pr-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${formErrors.gender ? 'border-red-500 text-red-900' : 'placeholder-gray-400'}`}
                                value={formData.gender}
                                onChange={handleChange}
                                required
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        {formErrors.gender && (
                            <p className="mt-2 text-sm text-red-600">{formErrors.gender}</p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <FormInput
                            id="password"
                            label="Password"
                            type="password"
                            autoComplete="new-password"
                            required
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            error={formErrors.password}
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                            }
                        />
                        <PasswordStrengthIndicator password={formData.password} />
                    </div>

                    <PasswordStrengthIndicator password={formData.password} />

                    <FormInput
                        id="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        autoComplete="new-password"
                        required
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={formErrors.confirmPassword}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                        }
                    />

                    <Button type="submit" fullWidth isLoading={loading}>
                        Sign up
                    </Button>
                    <Button 
                        onClick={handleGoogleSignUp}
                        fullWidth 
                        isLoading={loading}
                        variant="outline"
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                        }
                        className="border-gray-300 bg-white hover:bg-gray-50"
                    >
                        Sign up with Google
                    </Button>
                    <div className="text-center mt-4 space-y-2">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Sign in
                            </Link>
                        </p>
                        <p className="text-sm text-gray-600">
                            Already registered but need verification?{' '}
                            <Link to="/verify-email" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Verify email
                            </Link>
                        </p>
                    </div>
                </form>
            ) : (
                <form className="mt-8 space-y-6 animate-fadeIn focus-transition" onSubmit={handleConfirmSubmit}>
                    <FormInput
                        id="confirmationCode"
                        label="Confirmation Code"
                        type="text"
                        required
                        placeholder="Enter the code sent to your email"
                        value={confirmationCode}
                        autoFocus={true}
                        onChange={(e) => {
                            setConfirmationCode(e.target.value);
                            if (formErrors.confirmationCode) {
                                setFormErrors({
                                    ...formErrors,
                                    confirmationCode: '',
                                });
                            }
                        }}
                        error={formErrors.confirmationCode}
                    />

                    <Button type="submit" fullWidth isLoading={loading}>
                        Verify Account
                    </Button>

                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-600">
                            Didn't receive the code?{' '}
                            <button
                                type="button"
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                                onClick={() => {
                                    resendSignUpCode(formData.email);
                                    setSuccessMessage('Verification code has been sent again to your email address');
                                    // Không cần chuyển trang vì đã ở trang nhập code
                                }}
                            >
                                Resend code
                            </button>
                        </p>
                    </div>
                </form>
            )}
        </AuthCard>
    );
};

export default Register;
