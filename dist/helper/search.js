"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = void 0;
const convertToSlug_1 = require("./convertToSlug");
const search = (query) => {
    const objectSearch = {
        keyword: ""
    };
    if (query.keyword) {
        objectSearch.keyword = query.keyword;
        const textSlug = (0, convertToSlug_1.convertToSlug)(objectSearch.keyword);
        const slugRegex = new RegExp(textSlug, "i");
        const regex = new RegExp(objectSearch.keyword, "i");
        objectSearch["regex"] = regex;
        objectSearch["slug"] = slugRegex;
    }
    return objectSearch;
};
exports.search = search;
