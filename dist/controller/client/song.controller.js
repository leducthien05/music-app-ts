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
exports.listen = exports.listFavorite = exports.favorite = exports.like = exports.detail = exports.listByTopic = exports.index = void 0;
const song_model_1 = __importDefault(require("../../model/song.model"));
const topics_model_1 = __importDefault(require("../../model/topics.model"));
const singer_model_1 = __importDefault(require("../../model/singer.model"));
const song_favorite_model_1 = __importDefault(require("../../model/song-favorite.model"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const song = yield song_model_1.default.find({
        deleted: false,
        status: "active"
    });
    console.log("OK");
    res.render("client/page/song/index", {
        titlePage: "Songs",
        songs: song
    });
});
exports.index = index;
const listByTopic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topic_slug = req.params.slugTopic.toString() || "";
        const topic = yield topics_model_1.default.findOne({
            deleted: false,
            status: "active",
            slug: topic_slug
        });
        console.log(topic);
        const id = topic.id.toString();
        const songs = yield song_model_1.default.find({
            deleted: false,
            status: "active",
            topic_id: id
        }).select("nameSong singer_id avatar like slug").lean();
        for (const item of songs) {
            const infoSinger = yield singer_model_1.default.findOne({
                deleted: false,
                status: "active",
                _id: item.singer_id
            });
            if (!infoSinger) {
                return;
            }
            else {
                item["infoSinger"] = infoSinger;
            }
        }
        res.render("client/page/song/list", {
            titlePage: topic.title,
            topic: topic,
            songs: songs
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});
exports.listByTopic = listByTopic;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const song_slug = req.params.slugSong.toString() || "";
    const song = yield song_model_1.default.findOne({
        deleted: false,
        status: "active",
        slug: song_slug
    }).select("nameSong avatar audio singer_id topic_id like listen lyrics");
    if (!song) {
        return res.status(404).send("Song not found");
    }
    let liked = "0";
    let favorite = "0";
    if (res.locals.user) {
        const isLike = yield song_model_1.default.findOne({
            deleted: false,
            status: "active",
            slug: song_slug,
            "like.user_id": res.locals.user.id
        });
        if (isLike) {
            liked = "1";
        }
        const isFavorite = yield song_favorite_model_1.default.findOne({
            deleted: false,
            user_id: res.locals.user.id,
            song_id: song.id
        });
        let favorite = "0";
        if (isFavorite) {
            favorite = "1";
        }
    }
    const singer = yield singer_model_1.default.findOne({
        deleted: false,
        status: "active",
        _id: song.singer_id
    }).select("nameSinger slug");
    const topic = yield topics_model_1.default.findOne({
        deleted: false,
        status: "active",
        _id: song.topic_id
    }).select("title slug");
    res.render("client/page/song/detail", {
        titlePage: song.nameSong,
        song: song,
        singer: singer,
        topic: topic,
        liked: liked,
        favorite: favorite
    });
});
exports.detail = detail;
const like = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idUser = res.locals.user.id;
        const song_id = req.params.id.toString() || "";
        const action = req.params.action.toString() || "";
        const song = yield song_model_1.default.findOne({
            deleted: false,
            status: "active",
            _id: song_id
        });
        if (!song) {
            return res.status(404).send("Song not found");
        }
        if (action === "yes") {
            yield song_model_1.default.updateOne({
                deleted: false,
                status: "active",
                _id: song_id,
                "like.user_id": { $ne: res.locals.user.id }
            }, {
                $push: {
                    like: {
                        user_id: idUser,
                        createdAt: Date.now()
                    }
                }
            });
        }
        else {
            yield song_model_1.default.updateOne({
                deleted: false,
                status: "active",
                _id: song_id,
                "like.user_id": idUser
            }, {
                $pull: {
                    like: {
                        user_id: idUser,
                    }
                }
            });
        }
        const updatedSong = yield song_model_1.default.findById(song_id);
        res.json({
            code: 200,
            message: "Liked successfully",
            likeCount: updatedSong.like.length
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});
exports.like = like;
const favorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idUser = res.locals.user.id;
        const song_id = req.params.id.toString() || "";
        const action = req.params.action.toString() || "";
        if (action == "yes") {
            const exist = yield song_favorite_model_1.default.findOne({
                song_id: song_id,
                user_id: idUser
            });
            if (exist) {
                return res.json({
                    code: 200,
                    message: "Favorite successfully"
                });
            }
            const isFavorite = new song_favorite_model_1.default({
                song_id: song_id,
                user_id: idUser,
            });
            yield isFavorite.save();
            res.json({
                code: 200,
                message: "Favorite successfully"
            });
        }
        else {
            yield song_favorite_model_1.default.deleteOne({
                song_id: song_id,
                user_id: idUser
            });
            res.json({
                code: 200,
                message: "Unfavorite successfully"
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});
exports.favorite = favorite;
const listFavorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idUser = res.locals.user._id;
    const favoriteSongs = yield song_favorite_model_1.default.find({
        user_id: idUser,
        deleted: false
    });
    for (const item of favoriteSongs) {
        const infoSong = yield song_model_1.default.findOne({
            _id: item.song_id
        });
        const infoSinger = yield singer_model_1.default.findOne({
            _id: infoSong.singer_id
        });
        item["infoSong"] = infoSong;
        item["infoSinger"] = infoSinger;
    }
    res.render("client/page/song/favorite-song", {
        titlePage: "Nhạc yêu thích của bạn",
        favorite: favoriteSongs
    });
});
exports.listFavorite = listFavorite;
const listen = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idSong = req.params.idSong.toString();
        const song = yield song_model_1.default.findOne({
            deleted: false,
            status: "active",
            _id: idSong
        });
        if (!song) {
            return res.status(404).send("Song not found");
        }
        yield song_model_1.default.updateOne({
            _id: idSong,
            deleted: false,
            status: "active"
        }, {
            $inc: {
                listen: 1
            }
        });
        const listenSong = yield song_model_1.default.findById(idSong);
        res.json({
            code: 200,
            message: "Liked successfully",
            listenCount: listenSong.listen
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});
exports.listen = listen;
