import { convertToSlug } from "./convertToSlug";

export const search = (query: any) => {
    interface SearchResult {
        keyword: string;
        regex?: RegExp; // optional
        slug?: RegExp
    }
    const objectSearch: SearchResult = {
        keyword: ""
    }
    if (query.keyword) {
        objectSearch.keyword = query.keyword;
        const textSlug = convertToSlug(objectSearch.keyword);
        const slugRegex = new RegExp(textSlug, "i");
        const regex = new RegExp(objectSearch.keyword, "i");
        objectSearch["regex"] = regex;
        objectSearch["slug"] = slugRegex;
    }
    return objectSearch;
}