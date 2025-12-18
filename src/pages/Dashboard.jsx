import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCurrentUserProfile } from '../services/UserService';
import MainLayout from '../components/layout/MainLayout';

const Dashboard = () => {
    const { user, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('welcome');

    useEffect(() => {
        if (!authLoading) {
            setLoading(false);
        }
    }, [authLoading]);

    const isInstructor = user?.role === 'instructor';

    // Dữ liệu về các danh mục khóa học 
    const categories = [
        {
            id: 'programming',
            title: 'Lập trình',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
            ),
            description: 'Khám phá các khóa học về lập trình và phát triển ứng dụng',
            color: 'bg-blue-500'
        },
        {
            id: 'design',
            title: 'Thiết kế',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            description: 'Học thiết kế đồ họa, UI/UX và các kỹ năng sáng tạo',
            color: 'bg-pink-500'
        },
        {
            id: 'business',
            title: 'Kinh doanh',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            description: 'Phát triển kỹ năng kinh doanh, marketing và khởi nghiệp',
            color: 'bg-green-500'
        },
        {
            id: 'personal-dev',
            title: 'Phát triển cá nhân',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            description: 'Nâng cao kỹ năng mềm và phát triển bản thân toàn diện',
            color: 'bg-purple-500'
        }
    ];

    // Dữ liệu tính năng của nền tảng
    const features = [
        {
            id: 'interactive',
            title: 'Học tương tác',
            description: 'Tham gia các bài học với các phương tiện đa dạng và tương tác',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
            )
        },
        {
            id: 'share',
            title: 'Chia sẻ kiến thức',
            description: 'Tạo và chia sẻ khóa học, bài giảng của riêng bạn với cộng đồng',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
            )
        },
        {
            id: 'community',
            title: 'Cộng đồng học tập',
            description: 'Kết nối với cộng đồng học viên và người sáng tạo nội dung',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            )
        },
        {
            id: 'earn',
            title: 'Cơ hội thu nhập',
            description: 'Kiếm thu nhập từ việc tạo nội dung giáo dục chất lượng cao',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'welcome':
                return (
                    <div className="space-y-8">
                        {/* Hero Section */}
                        <div className="relative bg-gradient-to-r from-indigo-600 to-blue-500 rounded-xl overflow-hidden">
                            <div className="absolute inset-0 opacity-30 pattern-grid"></div>
                            <div className="relative px-6 py-12 md:py-16 md:px-12 text-white">
                                <h2 className="text-2xl md:text-3xl font-bold mb-4">Chào mừng, {user?.name || 'bạn'}!</h2>
                                <p className="text-lg md:text-xl mb-6 text-indigo-100 max-w-3xl">
                                    Khám phá và chia sẻ kiến thức trên EduConnect.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <Link to="/explore" className="px-6 py-3 bg-white text-indigo-700 font-medium rounded-lg hover:bg-opacity-90 transition shadow-lg">
                                        Khám phá khóa học
                                    </Link>
                                    {isInstructor && (
                                        <Link to="/series" className="px-6 py-3 bg-indigo-700 bg-opacity-40 border border-white text-white font-medium rounded-lg hover:bg-opacity-60 transition">
                                            Tạo khóa học
                                        </Link>
                                    )}
                                </div>
                            </div>
                            <div className="hidden lg:block absolute right-0 top-0 h-full w-1/3">
                                <div className="absolute right-0 top-0 h-full w-full bg-gradient-to-l from-transparent to-indigo-600"></div>
                                <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                                    <svg className="w-64 h-64 text-white opacity-20" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                                        <path fill="currentColor" d="M30.5,-51.1C38.9,-41.8,44.3,-31.2,47.7,-20.5C51,-9.8,52.2,1.1,50.2,11.7C48.2,22.3,43,32.6,34.6,39.8C26.1,47,14.5,51,1.1,49.5C-12.2,48,-27.3,40.9,-38.6,30.8C-49.9,20.8,-57.4,7.7,-57.9,-6.2C-58.4,-20.1,-51.9,-34.9,-41.4,-44.5C-30.9,-54.1,-16.3,-58.6,-2.2,-55.8C11.9,-53,22.2,-60.4,30.5,-51.1Z" transform="translate(100 100)" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* User Profile Card */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="md:flex">
                                <div className="md:w-1/3 bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white">
                                    <div className="flex flex-col items-center justify-center h-full">
                                        <div className="w-24 h-24 rounded-full bg-white p-1 shadow-xl mb-4 overflow-hidden">
                                            {user?.avatar ? (
                                                <img 
                                                    src={user.avatar} 
                                                    alt={user.name} 
                                                    className="w-full h-full object-cover rounded-full"
                                                />
                                            ) : (
                                                <div className="w-full h-full rounded-full bg-gradient-to-r from-indigo-100 to-blue-100 flex items-center justify-center text-3xl font-bold text-indigo-600">
                                                    {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-bold">{user?.name || 'Học viên'}</h3>
                                        <p className="text-indigo-100 mt-1">{user?.email}</p>

                                        {/* Hiển thị Role */}
                                        <div className={`mt-4 inline-flex items-center justify-center px-3 py-1 rounded-full ${isInstructor ? 'bg-yellow-500' : 'bg-white bg-opacity-20'} text-indigo-600 text-center text-sm`}>
                                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                            {isInstructor ? 'Giảng viên' : 'Học viên'}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 md:p-8 md:w-2/3">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Thông tin tài khoản</h3>
                                    <div className="grid gap-4 mb-6">
                                        <div className="flex items-center border-b border-gray-100 pb-4">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-4">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-600">Tên đầy đủ</div>
                                                <div className="font-medium text-gray-900">{user?.name || 'Chưa cập nhật'}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center border-b border-gray-100 pb-4">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-4">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-600">Email</div>
                                                <div className="font-medium text-gray-900">{user?.email || 'Chưa cập nhật'}</div>
                                            </div>
                                        </div>
                                        
                                    </div>
                                    <div className="flex gap-4">
                                        <Link to="/profile" className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition">
                                            Cập nhật thông tin
                                        </Link>
                                        <Link to="/change-password" className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition">
                                            Đổi mật khẩu
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Categories */}
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Danh mục khóa học</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {categories.map(category => (
                                    <Link
                                        to={`/explore?category=${encodeURIComponent(category.title)}`}
                                        key={category.id}
                                        className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition duration-300 transform hover:-translate-y-1 group"
                                    >
                                        <div className={`w-12 h-12 ${category.color} rounded-lg text-white flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300`}>
                                            {category.icon}
                                        </div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition duration-300">{category.title}</h4>
                                        <p className="text-gray-600">{category.description}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>

                       
                        
                    </div>
                );

            case 'explore':
                return (
                    <div className="space-y-8">
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Khám phá và chia sẻ tri thức</h3>
                            <p className="text-gray-600 mb-6">
                                EduConnect là nền tảng học tập mở, nơi bạn có thể học hỏi từ người khác và chia sẻ kiến thức của mình.
                                Tham gia học tập, đóng góp nội dung, và kết nối với cộng đồng học tập sôi động.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <div className="rounded-lg bg-gradient-to-br from-indigo-50 to-blue-50 p-6 border border-indigo-100">
                                    <div className="flex items-center mb-4">
                                        <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mr-3">1</span>
                                        <h4 className="text-lg font-medium text-gray-900">Học</h4>
                                    </div>
                                    <p className="text-gray-600">Tiếp cận kho tài nguyên học tập đa dạng với nội dung đóng góp từ cộng đồng.</p>
                                </div>

                                <div className="rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 p-6 border border-blue-100">
                                    <div className="flex items-center mb-4">
                                        <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">2</span>
                                        <h4 className="text-lg font-medium text-gray-900">Sáng tạo</h4>
                                    </div>
                                    <p className="text-gray-600">Tạo và chia sẻ khóa học, bài giảng với giao diện trực quan, dễ sử dụng.</p>
                                </div>

                                <div className="rounded-lg bg-gradient-to-br from-cyan-50 to-teal-50 p-6 border border-cyan-100">
                                    <div className="flex items-center mb-4">
                                        <span className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 mr-3">3</span>
                                        <h4 className="text-lg font-medium text-gray-900">Kết nối</h4>
                                    </div>
                                    <p className="text-gray-600">Tham gia cộng đồng, tương tác và nhận phản hồi từ người học và người dạy.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Link to="/explore" className="inline-block px-5 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition">
                                    Khám phá khóa học
                                </Link>
                                <Link to="/series" className="inline-block px-5 py-2 border border-indigo-600 text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition">
                                    Tạo khóa học mới
                                </Link>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="md:flex">
                                <div className="md:w-1/2 p-8">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Cộng đồng học tập</h3>
                                    <p className="text-gray-600 mb-6">
                                        Tham gia vào cộng đồng sôi động của EduConnect để kết nối, chia sẻ kiến thức và học hỏi từ những người khác.
                                    </p>
                                    <ul className="space-y-4 mb-6">
                                        <li className="flex items-start">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Thảo luận về các chủ đề học tập và giảng dạy</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Chia sẻ kinh nghiệm và nhận phản hồi từ cộng đồng</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Tạo dựng danh tiếng và phát triển mạng lưới của bạn</span>
                                        </li>
                                    </ul>
                                    <Link to="/community" className="inline-block px-5 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition">
                                        Tham gia cộng đồng
                                    </Link>
                                </div>
                                <div className="md:w-1/2 bg-gradient-to-tr from-indigo-600 to-purple-700 text-white p-8 rounded-xl shadow-lg">
                                    <h3 className="text-2xl font-bold mb-4">Trở thành người sáng tạo</h3>
                                    <p className="text-white/90 mb-8 text-lg">
                                        Chia sẻ kiến thức, xây dựng thương hiệu cá nhân và kiếm thu nhập từ nội dung của bạn.
                                    </p>
                                    <div className="space-y-4">
                                        <div className="bg-white/15 rounded-lg p-5 backdrop-blur-sm hover:bg-white/25 transition-all border border-white/10 hover:border-white/20 transform hover:-translate-y-1 duration-200">
                                            <h4 className="font-semibold text-lg text-white">Tạo khóa học</h4>
                                            <p className="text-sm text-white/80 mt-1">Đăng tải khóa học đầu tiên và bắt đầu chia sẻ kiến thức</p>
                                        </div>
                                        <div className="bg-white/15 rounded-lg p-5 backdrop-blur-sm hover:bg-white/25 transition-all border border-white/10 hover:border-white/20 transform hover:-translate-y-1 duration-200">
                                            <h4 className="font-semibold text-lg text-white">Xây dựng cộng đồng</h4>
                                            <p className="text-sm text-white/80 mt-1">Tương tác với học viên và phát triển người theo dõi</p>
                                        </div>
                                        <div className="bg-white/15 rounded-lg p-5 backdrop-blur-sm hover:bg-white/25 transition-all border border-white/10 hover:border-white/20 transform hover:-translate-y-1 duration-200">
                                            <h4 className="font-semibold text-lg text-white">Phát triển thu nhập</h4>
                                            <p className="text-sm text-white/80 mt-1">Kiếm tiền từ nội dung chất lượng của bạn</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'profile':
                return (
                    <div className="space-y-8">
                        <div className="bg-white shadow-md rounded-xl overflow-hidden">
                            <div className="border-b border-gray-100 px-6 py-4">
                                <h3 className="text-xl font-bold text-gray-900">Thông tin cá nhân</h3>
                            </div>
                            <div className="px-6 py-6">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                                        <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                                            {user?.name || 'Chưa cập nhật'}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                                            {user?.email || 'Chưa cập nhật'}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                                        <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                                            {user?.phoneNumber || 'Chưa cập nhật'}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Ngày tham gia</label>
                                        <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                                            {new Date().toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex flex-wrap gap-4">
                                    <Link to="/profile" className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition">
                                        Cập nhật thông tin
                                    </Link>
                                    <Link to="/change-password" className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition">
                                        Đổi mật khẩu
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white shadow-md rounded-xl overflow-hidden">
                            <div className="border-b border-gray-100 px-6 py-4">
                                <h3 className="text-xl font-bold text-gray-900">Cài đặt tài khoản</h3>
                            </div>
                            <div className="px-6 py-6">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium text-gray-900">Thông báo email</h4>
                                            <p className="text-sm text-gray-600 mt-1">Nhận email về các khóa học và tính năng mới</p>
                                        </div>
                                        <div className="flex items-center">
                                            <button className="relative inline-flex items-center h-6 rounded-full w-11 bg-indigo-600">
                                                <span className="translate-x-6 inline-block w-4 h-4 transform bg-white rounded-full"></span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium text-gray-900">Hiển thị tiến độ học tập</h4>
                                            <p className="text-sm text-gray-600 mt-1">Hiển thị tiến độ hoàn thành trong khóa học</p>
                                        </div>
                                        <div className="flex items-center">
                                            <button className="relative inline-flex items-center h-6 rounded-full w-11 bg-gray-200">
                                                <span className="translate-x-1 inline-block w-4 h-4 transform bg-white rounded-full"></span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium text-gray-900">Xác thực hai yếu tố</h4>
                                            <p className="text-sm text-gray-600 mt-1">Bảo mật tài khoản với xác thực hai yếu tố</p>
                                        </div>
                                        <div className="flex items-center">
                                            <button className="relative inline-flex items-center h-6 rounded-full w-11 bg-gray-200">
                                                <span className="translate-x-1 inline-block w-4 h-4 transform bg-white rounded-full"></span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    if (loading || authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin h-12 w-12 rounded-full border-t-4 border-indigo-600 border-solid"></div>
            </div>
        );
    }

    return (
        <MainLayout>
            <div className="bg-gray-50 min-h-screen pt-20 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">EduConnect</h1>
                            <p className="text-lg text-gray-600">Chào mừng quay trở lại, {user?.name || 'bạn'}!</p>
                        </div>
                        <div className="mt-4 md:mt-0 flex gap-3">
                            <Link to="/explore" className="inline-flex items-center px-4 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 transition">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                                Khám phá khóa học
                            </Link>
                            {isInstructor && (
                                <Link to="/series" className="inline-flex items-center px-4 py-2 border border-indigo-600 rounded-lg text-indigo-600 hover:bg-indigo-50 transition">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Tạo khóa học
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
                        <div className="border-b border-gray-200">
                            <div className="px-4 sm:px-8">
                                
                            </div>
                        </div>
                        <div className="p-6 sm:p-8">
                            {renderTabContent()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom CSS for pattern background */}
            <style jsx="true">{`
                .pattern-grid {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
                }
            `}</style>
        </MainLayout>
    );
};

export default Dashboard;
