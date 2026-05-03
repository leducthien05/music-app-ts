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
exports.listByTopic = exports.index = void 0;
const topics_model_1 = __importDefault(require("../../model/topics.model"));
const song_model_1 = __importDefault(require("../../model/song.model"));
const singer_model_1 = __importDefault(require("../../model/singer.model"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const topic = yield topics_model_1.default.find({
        deleted: false,
        status: "active"
    }).limit(6);
    res.render("client/page/topics/index", {
        titlePage: "Thể loại nhạc",
        topic: topic
    });
});
exports.index = index;
const listByTopic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topic_slug = req.params.slug.toString() || "";
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
        res.render("client/page/topics/list", {
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
