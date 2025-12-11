import MainLayout from '../components/layout/MainLayout';
import useSeriesManagement from '../hooks/useSeriesManagement';
import SeriesList from '../components/series/SeriesList';
import CreateSeriesModal from '../components/series/CreateSeriesModal';
import EditSeriesModal from '../components/series/EditSeriesModal';
import DeleteSeriesModal from '../components/series/DeleteSeriesModal';
import SeriesFilters from '../components/series/SeriesFilters';
import EmptyState from '../components/common/EmptyState';
import Loading from '../components/common/Loading';
import ErrorAlert from '../components/common/ErrorAlert';
import ErrorModal from '../components/common/ErrorModal';
import Button from '../components/common/Button';

import { useAuth } from '../context/AuthContext';

/**
 * Trang quản lý series
 */
const SeriesManagementPage = () => {
    const { user } = useAuth();
    const isInstructor = user?.data?.role === 'instructor';

    const {
        series,
        loading,
        error,
        setError,
        searchQuery,
        setSearchQuery,
        filterStatus,
        setFilterStatus,
        sortBy,
        setSortBy,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        seriesToDelete,
        setSeriesToDelete,
        isCreateModalOpen,
        setIsCreateModalOpen,
        isEditModalOpen,
        setIsEditModalOpen,
        newSeries,
        setNewSeries,
        editFormData,
        setEditFormData,
        seriesToEdit,
        formErrors,
        isSubmitting,
        isDeleting,
        isErrorModalOpen,
        setIsErrorModalOpen,
        errorMessage,
        handleDeleteSeries,
        handleCreateSeries,
        handleEditSeries,
        handleOpenEditModal,
        handleTogglePublish
    } = useSeriesManagement();

    // EmptyState component content
    const emptyStateIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
    );

    const emptyStateAction = (
        <Button
            onClick={() => setIsCreateModalOpen(true)}
            variant="primary"
            icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            }
        >
            Tạo Series Đầu Tiên
        </Button>
    );

    const emptyStateComponent = (
        <EmptyState
            icon={emptyStateIcon}
            title="Chưa có series nào"
            description="Bạn chưa tạo series nào hoặc không tìm thấy kết quả phù hợp."
            action={emptyStateAction}
        />
    );

    return (
        // isInstructor && (
            <MainLayout>
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Quản lý Series</h1>
                            <p className="text-gray-600 mt-1">Tạo và quản lý các series bài giảng của bạn</p>
                        </div>
                        
                        <Button
                            onClick={() => setIsCreateModalOpen(true)}
                            variant="primary"
                            className="mt-4 md:mt-0"
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            }
                        >
                            Tạo Series Mới
                        </Button>
                        
                    </div>
                    
                    {/* Search and filter controls */}
                    <SeriesFilters
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        filterStatus={filterStatus}
                        onFilterStatusChange={setFilterStatus}
                        sortBy={sortBy}
                        onSortByChange={setSortBy}
                    />

                    {/* Loading and error states */}
                    {loading ? (
                        <Loading />
                    ) : error ? (
                        <ErrorAlert message={error} onDismiss={() => setError(null)} />
                    ) : (
                        <SeriesList
                            series={series}
                            onDeleteClick={(item) => {
                                setSeriesToDelete(item);
                                setIsDeleteModalOpen(true);
                            }}
                            onEditClick={handleOpenEditModal}
                            onPublishClick={handleTogglePublish}
                            noItemsComponent={emptyStateComponent}
                        />
                    )}
                </div>
                {/* Modals */}
                <CreateSeriesModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSubmit={handleCreateSeries}
                    formData={newSeries}
                    setFormData={setNewSeries}
                    formErrors={formErrors}
                    isSubmitting={isSubmitting}
                />

                <EditSeriesModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSubmit={handleEditSeries}
                    formData={editFormData}
                    setFormData={setEditFormData}
                    formErrors={formErrors}
                    isSubmitting={isSubmitting}
                    series={seriesToEdit}
                />

                <DeleteSeriesModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                        setSeriesToDelete(null);
                    }}
                    onConfirm={handleDeleteSeries}
                    series={seriesToDelete}
                    isDeleting={isDeleting}
                />

                <ErrorModal
                    isOpen={isErrorModalOpen}
                    onClose={() => setIsErrorModalOpen(false)}
                    title="Không thể xóa Series"
                    message={errorMessage}
                    buttonText="Đóng"
                />
            </MainLayout>
        //)
    );
};

export default SeriesManagementPage;