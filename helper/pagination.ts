export const pagination = (query: any, count: number) => {
    interface Pagination {
        currentPage: number;
        limit: number;
        skip?: number;
        totalPage?: number;
    }

    const objectPagination: Pagination = {
        currentPage: 1,
        limit: 10
    };

    // page
    if (query.page) {
        objectPagination.currentPage = parseInt(query.page) || 1;
    }

    // total page
    objectPagination.totalPage = Math.ceil(
        count / objectPagination.limit
    );

    // skip
    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limit;

    return objectPagination;
};