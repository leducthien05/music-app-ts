"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_slug_updater_1 = __importDefault(require("mongoose-slug-updater"));
mongoose_1.default.plugin(mongoose_slug_updater_1.default);
const songSchema = new mongoose_1.default.Schema({
    nameSong: String,
    singer_id: String,
    avatar: String,
    description: String,
    topic_id: String,
    releaseDate: Date,
    like: [
        {
            user_id: String,
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    audio: String,
    lyrics: String,
    status: String,
    listen: {
        type: Number,
        default: 0
    },
    slug: {
        type: String,
        slug: "nameSong",
        unique: true
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date,
}, {
    timestamps: true
});
const Song = mongoose_1.default.model("Song", songSchema, "songs");
exports.default = Song;
