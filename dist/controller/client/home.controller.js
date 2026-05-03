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
const song_model_1 = __importDefault(require("../../model/song.model"));
const topics_model_1 = __importDefault(require("../../model/topics.model"));
const singer_model_1 = __importDefault(require("../../model/singer.model"));
const song_favorite_model_1 = __importDefault(require("../../model/song-favorite.model"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const singers = yield singer_model_1.default.find({
        deleted: false,
        status: "active"
    }).limit(6);
    const idSinger = singers.map(item => item.id);
    const topics = yield topics_model_1.default.find({
        deleted: false,
        status: "active"
    }).limit(6);
    const idTopic = topics.map(item => item.id);
    const songs = yield song_model_1.default.find({
        deleted: false,
        status: "active",
        topic_id: { $in: idTopic },
        singer_id: { $in: idSinger }
    }).limit(10);
    let favorite = "0";
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
            if (isFavorite) {
                favorite = "1";
            }
        }
    }
    res.render("client/page/home/index", {
        titlePage: "Songs",
        songs: songs,
        singer: singers,
        topic: topics,
        favorite: favorite
    });
});
exports.index = index;
