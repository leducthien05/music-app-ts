import { create } from "domain";
import mongoose from "mongoose";
import slugify from "slugify";

const songSchema = new mongoose.Schema({
    nameSong: String,
    singer_id: String,
    avatar: String,
    description: String,
    topic_id: String,
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
    },
    {
        timestamps: true
    }
);

const Song = mongoose.model("Song", songSchema, "songs");
export default Song;