import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../auth/Button';
import FormInput from '../auth/FormInput';
import FormSelect from '../auth/FormSelect';
import { updateUserProfile } from '../../services/UserService';

const UserProfile = ({ onAvatarClick }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [activeSection, setActiveSection] = useState('personal');
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        birthdate: '',
        gender: '',
        phoneNumber: '',
        address: '',
        city: '',
        country: '',
        bio: '',
    });

    // Validate form inputs
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        const loadUserData = async () => {
            if (user) {
                try {
                    setProfileData(user.data || {});
                } catch (error) {
                    console.error('Error loading user data:', error);
                    setErrorMessage('Failed to load profile data. Please try again later.');
                }
            }
            setLoading(false);
        };

        loadUserData();
    }, [user]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [id]: value,
        }));

        // Clear error when user starts typing
        if (formErrors[id]) {
            setFormErrors(prev => ({
                ...prev,
                [id]: '',
            }));
        }
    };

    const validateForm = () => {
        const errors = {};
        let isValid = true;

        // Validate required fields
        if (!profileData.name?.trim()) {
            errors.name = 'Full name is required';
            isValid = false;
        }

        // Only validate phone if provided
        if (profileData.phoneNumber && !/^\d{10,15}$/.test(profileData.phoneNumber)) {
            errors.phoneNumber = 'Please enter a valid phone number';
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

        setSaving(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            if (user) {
                // Prepare data to send to the server
                const updatedData = {
                    name: profileData.name,
                    email: profileData.email,
                    birthdate: profileData.birthdate,
                    gender: profileData.gender,
                    phoneNumber: profileData.phoneNumber,
                    address: profileData.address,
                    updateAt: new Date(),
                    city: profileData.city,
                    country: profileData.country,
                    bio: profileData.bio
                };

                const userId = user.userId || user.data?._id || user.data?.cognito_sub;

                if (!userId) {
                     throw new Error('User ID is missing');
                }

                await updateUserProfile(userId, updatedData);

                setSuccessMessage('Profile updated successfully!');

                // Clear success message after 3 seconds
                setTimeout(() => {
                    setSuccessMessage('');
                }, 3000);
            } else {
                throw new Error('User ID not found');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setErrorMessage(error.response?.data?.message || 'Failed to update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin h-8 w-8 border-4 border-indigo-600 rounded-full border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            {/* Header with profile picture section */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
                <div className="flex items-center">
                    <div className="relative group">
                        <button 
                            className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-indigo-600 text-3xl font-bold uppercase mr-4 border-4 border-white shadow-lg hover:shadow-xl transition-all duration-300 hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={onAvatarClick}
                            aria-label="Change avatar"
                        >
                            {profileData.name ? profileData.name.charAt(0) : 'U'}
                        </button>
                        <div className="absolute bottom-0 right-4 bg-indigo-600 text-white text-center text-xs rounded-full py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            Change avatar
                        </div>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">{profileData.name || 'Your Profile'}</h1>
                        <p className="opacity-90">{profileData.email}</p>
                    </div>
                </div>
            </div>

            {/* Navigation tabs */}
            <div className="border-b border-gray-200">
                
            </div>

            <div className="p-6">
                {successMessage && (
                    <div className="bg-green-50 text-green-800 p-4 rounded-md mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {successMessage}
                    </div>
                )}

                {errorMessage && (
                    <div className="bg-red-50 text-red-800 p-4 rounded-md mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Personal Information Section */}
                    <div className={activeSection === 'personal' ? 'block' : 'hidden'}>
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput
                                id="name"
                                label="Full Name"
                                type="text"
                                value={profileData.name || ''}
                                onChange={handleChange}
                                error={formErrors.name}
                                placeholder="Enter your full name"
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                }
                            />

                            <FormInput
                                id="email"
                                label="Email Address"
                                type="email"
                                value={profileData.email || ''}
                                readOnly
                                disabled
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
                                value={profileData.birthdate || ''}
                                onChange={handleChange}
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                }
                            />

                            <FormSelect
                                id="gender"
                                label="Gender"
                                value={profileData.gender || ''}
                                onChange={handleChange}
                                options={[
                                    { value: "", label: "Select gender" },
                                    { value: "male", label: "Male" },
                                    { value: "female", label: "Female" },
                                    { value: "other", label: "Other" }
                                ]}
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                }
                            />
                        </div>
                    </div>

                    {/* Contact Details Section */}
                    <div className={activeSection === 'contact' ? 'block' : 'hidden'}>
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput
                                id="phoneNumber"
                                label="Phone Number"
                                type="tel"
                                value={profileData.phoneNumber || ''}
                                onChange={handleChange}
                                error={formErrors.phoneNumber}
                                placeholder="Enter your phone number"
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                    </svg>
                                }
                            />

                            <FormInput
                                id="address"
                                label="Address"
                                type="text"
                                value={profileData.address || ''}
                                onChange={handleChange}
                                placeholder="Enter your street address"
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                }
                            />

                            <FormInput
                                id="city"
                                label="City"
                                type="text"
                                value={profileData.city || ''}
                                onChange={handleChange}
                                placeholder="Enter your city"
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                    </svg>
                                }
                            />

                            <FormInput
                                id="country"
                                label="Country"
                                type="text"
                                value={profileData.country || ''}
                                onChange={handleChange}
                                placeholder="Enter your country"
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                                    </svg>
                                }
                            />
                        </div>
                    </div>

                    {/* Bio Section */}
                    <div className={activeSection === 'bio' ? 'block' : 'hidden'}>
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Biography</h2>
                        <div>
                            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                                Tell us about yourself
                            </label>
                            <textarea
                                id="bio"
                                rows="6"
                                className="block w-full px-4 py-3 border border-gray-200 rounded-md focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-300"
                                placeholder="Share your interests, experience, or anything else you'd like others to know..."
                                value={profileData.bio || ''}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <Button type="submit" isLoading={saving} className="px-6">
                            Save Profile
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserProfile;
