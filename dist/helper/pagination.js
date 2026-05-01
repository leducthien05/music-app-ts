"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagination = void 0;
const pagination = (query, count) => {
    const objectPagination = {
        currentPage: 1,
        limit: 10
    };
    if (query.page) {
        objectPagination.currentPage = parseInt(query.page) || 1;
    }
    objectPagination.totalPage = Math.ceil(count / objectPagination.limit);
    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limit;
    return objectPagination;
};
exports.pagination = pagination;
