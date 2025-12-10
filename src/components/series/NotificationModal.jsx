import { useState, useEffect } from 'react';

/**
 * Modal để tạo thông báo cho series
 */
const NotificationModal = ({
    isOpen,
    onClose,
    onSubmit,
    initialData = null // SỬA: Đổi {} thành null để tránh tạo object mới liên tục gây re-render
}) => {
    const [formData, setFormData] = useState({
        notification_title: '',
        notification_content: '',
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Populate form data if editing or reset when opening
    useEffect(() => {
        if (isOpen) {
            setFormData({
                notification_title: initialData?.notification_title || '',
                notification_content: initialData?.notification_content || '',
            });
            setErrors({}); // Xóa lỗi cũ nếu có
        }
    }, [isOpen, initialData]); // Thêm isOpen vào dependency

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Update form data
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));

        // Clear error when user starts typing
        setErrors(prevErrors => {
            if (prevErrors[name]) {
                return {
                    ...prevErrors,
                    [name]: null
                };
            }
            return prevErrors;
        });
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.notification_title.trim()) {
            newErrors.notification_title = 'Tiêu đề thông báo không được để trống';
        }

        if (!formData.notification_content.trim()) {
            newErrors.notification_content = 'Nội dung thông báo không được để trống';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setIsSubmitting(true);
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Prevent closing modal when clicking inside the content
    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center" onClick={onClose}>
            <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="relative bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={handleContentClick}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-medium text-gray-900">
                         {initialData ? 'Cập nhật thông báo' : 'Gửi thông báo đến học viên'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <span className="sr-only">Close</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-6">
                        <div>
                            <label htmlFor="notification_title" className="block text-sm font-medium text-gray-700 mb-1">
                                Tiêu đề thông báo <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="notification_title"
                                name="notification_title"
                                value={formData.notification_title}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.notification_title ? 'border-red-300' : 'border-gray-300'}`}
                                placeholder="Nhập tiêu đề thông báo"
                            />
                            {errors.notification_title && (
                                <p className="mt-1 text-sm text-red-600">{errors.notification_title}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="notification_content" className="block text-sm font-medium text-gray-700 mb-1">
                                Nội dung thông báo <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="notification_content"
                                name="notification_content"
                                rows={5}
                                value={formData.notification_content}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.notification_content ? 'border-red-300' : 'border-gray-300'}`}
                                placeholder="Nhập nội dung thông báo"
                            />
                            {errors.notification_content && (
                                <p className="mt-1 text-sm text-red-600">{errors.notification_content}</p>
                            )}
                        </div>

                        <div className="text-sm text-gray-500">
                            <p> Học viên đã đăng ký theo dõi khóa học này sẽ nhận được email thông báo.</p>
                        </div>
                    </div>

                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm ${isSubmitting ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Đang gửi...
                                </>
                            ) : 'Gửi thông báo'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Hủy bỏ
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NotificationModal;