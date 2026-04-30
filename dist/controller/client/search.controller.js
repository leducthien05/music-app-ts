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
exports.suggest = exports.result = exports.index = void 0;
const song_model_1 = __importDefault(require("../../model/song.model"));
const singer_model_1 = __importDefault(require("../../model/singer.model"));
const song_favorite_model_1 = __importDefault(require("../../model/song-favorite.model"));
const convertToSlug_1 = require("../../helper/convertToSlug");
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("client/page/search/index", {
        titlePage: "Tìm kiếm"
    });
});
exports.index = index;
const result = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const keyword = req.query.keyword.toString();
    let result = [];
    let favorite = "0";
    if (req.query.keyword) {
        const nameSong = new RegExp(keyword, "i");
        const textSearch = (0, convertToSlug_1.convertToSlug)(keyword);
        const textSearchSlug = new RegExp(textSearch, "i");
        const songs = yield song_model_1.default.find({
            deleted: false,
            $or: [
                { slug: textSearchSlug },
                { nameSong: nameSong }
            ]
        });
        for (const item of songs) {
            const infoSinger = yield singer_model_1.default.findOne({
                deleted: false,
                _id: item.singer_id
            });
            item["infoSinger"] = infoSinger;
            if (res.locals.user) {
                const isFavorite = yield song_favorite_model_1.default.findOne({
                    deleted: false,
                    user_id: res.locals.user.id,
                    song_id: item.id
                });
                let favorite = "0";
                if (isFavorite) {
                    favorite = "1";
                }
            }
        }
        result = songs;
    }
    res.render("client/page/search/index", {
        titlePage: "Tìm kiếm",
        keyword: keyword,
        songs: result,
        favorite: favorite
    });
});
exports.result = result;
const suggest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const keyword = req.query.keyword.toString();
    let result = [];
    if (keyword) {
        const nameSong = new RegExp(keyword, "i");
        const textSearch = (0, convertToSlug_1.convertToSlug)(keyword);
        const textSearchSlug = new RegExp(textSearch, "i");
        const songs = yield song_model_1.default.find({
            deleted: false,
            $or: [
                { slug: textSearchSlug },
                { nameSong: nameSong }
            ]
        });
        for (const item of songs) {
            const infoSinger = yield singer_model_1.default.findOne({
                deleted: false,
                _id: item.singer_id
            });
            result.push({
                id: item.id,
                nameSong: item.nameSong,
                avatar: item.avatar,
                description: item.description,
                like: item.like,
                infoSinger: infoSinger
            });
        }
    }
    res.json({
        code: 200,
        result: result
    });
});
exports.suggest = suggest;
