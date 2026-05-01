"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.index = void 0;
const topics_model_1 = __importDefault(require("../../model/topics.model"));
const search_1 = require("../../helper/search");
const pagination_1 = require("../../helper/pagination");
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const find = {
        deleted: false
    };
    const count = yield topics_model_1.default.countDocuments(find);
    const objectPagination = (0, pagination_1.pagination)(req.query, count);
    if (req.query.keyword) {
        const objectSearch = (0, search_1.search)(req.query);
        const nameSong = objectSearch.regex;
        const textSlug = objectSearch.slug;
        find["$or"] = [
            { nameSong: nameSong },
            { slug: textSlug }
        ];
    }
    const topic = yield topics_model_1.default.find(find).skip(objectPagination.skip).limit(objectPagination.limit);
    res.render("admin/page/topic/index", {
        titlePage: "Thể loại",
        topics: topic,
        pagination: objectPagination
    });
});
exports.index = index;
