import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import SearchHero from '../components/explore/SearchHero';
import SearchFilters from '../components/explore/SearchFilters';
import SearchResults from '../components/explore/SearchResults';
import seriesService from '../services/SeriesService';

const ExplorePage = () => {
    // State management
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [sortOption, setSortOption] = useState('relevance');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();

    // Handle search action
    const handleSearch = useCallback(async (query) => {
        setIsLoading(true);
        setError(null);
        setSearchQuery(query);
        setPage(1); // Reset to first page on new search

        try {
            const results = await seriesService.searchSeriesByTitle(query);
            setSearchResults(results || []);
            setTotalPages(Math.ceil((results?.length || 0) / 12));
        } catch (err) {
            setError(err.message || 'Đã xảy ra lỗi khi tìm kiếm');
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Handle filter changes
    const handleApplyFilters = useCallback((categories) => {
        setSelectedCategories(categories);
        setPage(1); // Reset to first page when filters change
        
        // Update URL with category filter
        if (categories.length > 0) {
            setSearchParams({ category: categories.join(',') });
        } else {
            setSearchParams({});
        }
    }, [setSearchParams]);

    // Handle sort changes
    const handleSortChange = useCallback((option) => {
        setSortOption(option);
    }, []);

    // Handle pagination
    const handlePageChange = useCallback((newPage) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    // Process results based on filters and sorting
    const processResults = useCallback(() => {
        // Apply category filters
        const filtered = selectedCategories.length > 0
            ? searchResults.filter(series => selectedCategories.includes(series.serie_category))
            : searchResults;

        // Apply sorting
        return [...filtered].sort((a, b) => {
            switch (sortOption) {
                case 'newest':
                    return new Date(b.created_at || 0) - new Date(a.created_at || 0);
                case 'popular':
                    return (b.students_count || 0) - (a.students_count || 0);
                case 'rating':
                    return (b.rating || 0) - (a.rating || 0);
                case 'relevance':
                default:
                    return 0; // Keep original order for relevance
            }
        });
    }, [searchResults, selectedCategories, sortOption]);

    // Load initial data
    useEffect(() => {
        const loadInitialSeries = async () => {
            setIsLoading(true);
            try {
                const seriesList = await seriesService.getAllSeries();
                const series = (seriesList || []).filter(item => item.isPublish === true);
                setSearchResults(series || []);
                setTotalPages(Math.ceil((series?.length || 0) / 12));
            } catch (err) {
                setError(err.message || 'Đã xảy ra lỗi khi tải series');
                setSearchResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialSeries();
    }, []);

    // Handle URL parameter changes
    useEffect(() => {
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
            const categories = categoryParam.split(',');
            setSelectedCategories(categories);
        } else {
            setSelectedCategories([]);
        }
    }, [searchParams]);

    // Get the final data to display
    const processedResults = processResults();
    const displayResults = processedResults.slice((page - 1) * 12, page * 12);

    return (
        <MainLayout fullWidth>
            {/* Hero Search Section */}
            <SearchHero
                onSearch={handleSearch}
                isLoading={isLoading}
            />

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-8 relative">
                {/* Background decorative elements */}
                <div className="absolute inset-0 overflow-hidden -z-10">
                    <div className="absolute -top-40 -left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute top-0 -right-20 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-40 left-20 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
                </div>

                {/* Filters and Results Area */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar - Mobile Friendly */}
                    <SearchFilters
                        onApplyFilters={handleApplyFilters}
                        selectedCategories={selectedCategories}
                        totalResults={processedResults.length}
                        sortOption={sortOption}
                        onSortChange={handleSortChange}
                    />

                    {/* Search Results */}
                    <SearchResults
                        results={displayResults}
                        totalResults={processedResults.length}
                        isLoading={isLoading}
                        error={error}
                        searchQuery={searchQuery}
                        page={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </MainLayout>
    );
};

export default ExplorePage;