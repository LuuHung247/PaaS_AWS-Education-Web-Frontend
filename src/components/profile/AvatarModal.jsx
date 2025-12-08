import { useState } from 'react';
import Button from '../auth/Button';

const AvatarModal = ({ isOpen, onClose, onSave }) => {
    const [avatarUrl, setAvatarUrl] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(avatarUrl);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-white/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Change Avatar</h3>
                        <button 
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-700 mb-2">
                                Avatar URL
                            </label>
                            <input
                                type="text"
                                id="avatarUrl"
                                className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-300"
                                placeholder="Enter image URL"
                                value={avatarUrl}
                                onChange={(e) => setAvatarUrl(e.target.value)}
                            />
                            <p className="mt-2 text-sm text-gray-500">
                                Enter a valid image URL or upload an image
                            </p>
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Or Upload Image
                            </label>
                            <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <div className="flex text-sm text-gray-600">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                            <span>Upload a file</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        PNG, JPG, GIF up to 10MB
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex justify-end space-x-3">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">
                                Update Avatar
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AvatarModal;