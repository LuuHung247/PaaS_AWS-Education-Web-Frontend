import { Link } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { useState, useEffect } from 'react';

const Home = () => {
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    // Using your original testimonials
    const testimonials = [
        {
            quote: "EduConnect has completely transformed my teaching approach. I've been able to reach thousands of students worldwide with my programming courses.",
            name: "Sarah Johnson",
            position: "Programming Instructor",
            company: "Tech Academy"
        },
        {
            quote: "The platform makes it so easy to create and share educational content. The analytics tools help me understand what my students need most.",
            name: "David Chen",
            position: "Mathematics Teacher",
            company: "Learning Hub"
        },
        {
            quote: "As a student, I've found amazing courses here that weren't available anywhere else. The interactive lessons and community support are outstanding.",
            name: "Maya Patel",
            position: "Computer Science Student",
            company: "State University"
        }
    ];

    // Auto-rotate testimonials
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [testimonials.length]);

    return (
        <MainLayout>
            {/* Hero Section - Modern with vibrant gradients */}
            <section className="relative overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-purple-800 to-indigo-900"></div>

                {/* Decorative elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 -left-20 w-80 h-80 bg-pink-500 opacity-20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-500 opacity-20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
                    <div className="absolute top-1/3 right-1/3 w-60 h-60 bg-purple-500 opacity-20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>

                    {/* Decorative grid pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',
                            backgroundSize: '30px 30px'
                        }}></div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-24 lg:py-32 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center justify-between">
                        <div className="lg:w-1/2 mb-12 lg:mb-0 text-white">
                            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full mb-6 border border-white/20">
                                <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                                <span className="text-sm font-medium text-white">Educational Platform</span>
                            </div>

                            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                                <span className="block">Transform Knowledge</span>
                                <span className="bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 text-transparent bg-clip-text">Into Digital Experiences</span>
                            </h1>

                            <p className="text-xl text-indigo-100 mb-8 max-w-xl">
                                Create engaging educational content, reach learners worldwide, and build your digital teaching platform with advanced analytics.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Link
                                    to="/series"
                                    className="px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300"
                                >
                                    Start Creating
                                </Link>
                                <Link
                                    to="/explore"
                                    className="px-8 py-4 bg-white/10 backdrop-blur-sm rounded-xl text-black font-semibold border border-white/20 hover:bg-white/20 hover:translate-y-[-2px] transition-all duration-300"
                                >
                                    Explore Courses
                                </Link>
                            </div>
                        </div>

                        {/* 3D-looking interface mockup */}
                        <div className="lg:w-1/2 lg:pl-8">
                            <div className="relative">
                                {/* Glow effect */}
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl blur-lg opacity-75"></div>

                                {/* Main card */}
                                <div className="relative bg-gray-900 border border-gray-800 p-2 rounded-2xl shadow-2xl">
                                    {/* Window controls */}
                                    <div className="flex items-center gap-1.5 mb-3 px-2">
                                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    </div>

                                    {/* Interface mockup */}
                                    <div className="bg-gray-800 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="h-6 w-36 bg-gray-700 rounded-md"></div>
                                            <div className="h-8 w-24 bg-purple-700 rounded-md"></div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="h-32 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-lg p-4 flex flex-col justify-between">
                                                <div className="w-8 h-8 bg-indigo-700 rounded-lg flex items-center justify-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                                    </svg>
                                                </div>
                                                <div className="h-3 w-20 bg-indigo-700/50 rounded-md"></div>
                                            </div>

                                            <div className="h-32 bg-gradient-to-br from-pink-900 to-purple-900 rounded-lg p-4 flex flex-col justify-between">
                                                <div className="w-8 h-8 bg-pink-700 rounded-lg flex items-center justify-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                                                    </svg>
                                                </div>
                                                <div className="h-3 w-20 bg-pink-700/50 rounded-md"></div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="h-5 bg-gray-700 rounded w-full"></div>
                                            <div className="h-5 bg-gray-700 rounded w-5/6"></div>
                                            <div className="h-5 bg-gray-700 rounded w-3/4"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating badge */}
                                <div className="absolute -right-4 -bottom-4 bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-2 rounded-lg shadow-lg text-white font-medium transform rotate-3">
                                    <div className="flex items-center space-x-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Powerful Analytics</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Wave separator */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" fill="#ffffff">
                        <path fillOpacity="1" d="M0,256L48,229.3C96,203,192,149,288,138.7C384,128,480,160,576,186.7C672,213,768,235,864,229.3C960,224,1056,192,1152,176C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>
            </section>

            {/* Features Section - Modern with glass cards */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 font-medium rounded-full text-sm mb-4">Platform Features</span>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Tools to Enhance Your Teaching</h2>
                        <p className="text-lg text-gray-600">Our platform provides everything you need to create, manage, and monetize your educational content.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature Card 1 */}
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                            <div className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
                                <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg mb-6 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Interactive Content Studio</h3>
                                <p className="text-gray-600 mb-6">Create engaging video courses, quizzes, and interactive lessons with our intuitive authoring tools.</p>
                                <Link to="/features/content-studio" className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-700 transition-colors">
                                    Learn more
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </Link>
                            </div>
                        </div>

                        {/* Feature Card 2 */}
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                            <div className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
                                <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg mb-6 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Advanced Analytics</h3>
                                <p className="text-gray-600 mb-6">Track audience engagement, completion rates, and learning patterns with real-time dashboards.</p>
                                <Link to="/features/analytics" className="inline-flex items-center text-purple-600 font-medium hover:text-purple-700 transition-colors">
                                    Learn more
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </Link>
                            </div>
                        </div>

                        {/* Feature Card 3 */}
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                            <div className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
                                <div className="w-14 h-14 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg mb-6 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Flexible Monetization</h3>
                                <p className="text-gray-600 mb-6">Choose from multiple revenue models including subscriptions, one-time purchases, and memberships.</p>
                                <Link to="/features/monetization" className="inline-flex items-center text-pink-600 font-medium hover:text-pink-700 transition-colors">
                                    Learn more
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section - Modern styling */}
            <section className="py-20 bg-gradient-to-b from-white to-indigo-50">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 font-medium rounded-full text-sm mb-4">Success Stories</span>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Community Says</h2>
                        <p className="text-lg text-gray-600">Hear from educators and creators who have transformed their teaching with our platform.</p>
                    </div>

                    <div className="max-w-4xl mx-auto relative">
                        {/* Decorative elements */}
                        <div className="absolute -top-10 -left-10 w-20 h-20 text-indigo-200">
                            <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z" fill="currentColor" />
                            </svg>
                        </div>

                        {/* Testimonial slider with modern glass effect */}
                        <div className="relative bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-10 border border-indigo-100 overflow-hidden">
                            <div className="overflow-hidden">
                                <div className="transition-all duration-500 ease-in-out flex" style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}>
                                    {testimonials.map((testimonial, index) => (
                                        <div key={index} className="min-w-full">
                                            <div className="flex flex-col items-center text-center">
                                                <div className="w-20 h-20 mb-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 p-1">
                                                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                                        <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
                                                            {testimonial.name.charAt(0)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-xl text-gray-700 italic mb-8 max-w-2xl">"{testimonial.quote}"</p>
                                                <h4 className="font-bold text-lg text-gray-900">{testimonial.name}</h4>
                                                <p className="text-indigo-600">{testimonial.position}, {testimonial.company}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Modern pagination dots */}
                            <div className="flex justify-center mt-8">
                                {testimonials.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveTestimonial(index)}
                                        className={`w-2.5 h-2.5 rounded-full mx-1.5 transition-all duration-300 ${activeTestimonial === index
                                            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 w-8'
                                            : 'bg-gray-300'
                                            }`}
                                        aria-label={`Testimonial ${index + 1}`}
                                    ></button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section - Vibrant and modern */}
            <section className="relative py-20 overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-800 via-purple-800 to-pink-800"></div>

                {/* Decorative elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10">
                        <div className="absolute" style={{
                            backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)',
                            backgroundSize: '40px 40px',
                            width: '200%',
                            height: '200%',
                            transform: 'rotate(-15deg)',
                            left: '-50%',
                            top: '-50%'
                        }}></div>
                    </div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 bg-indigo-600 rounded-full opacity-20 filter blur-3xl"></div>
                </div>

                
            </section>
        </MainLayout>
    );
};

export default Home;