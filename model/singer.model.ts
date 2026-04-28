import mongoose from "mongoose";
import slugify from "slugify";

const singerSchema = new mongoose.Schema({
    nameSinger: String,
    avatar: String,
    description: String,
    status: String,
    slug: {
        type: String,
        slug: "title",
        unique: true
    },
    fan: Number,
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

const Singer = mongoose.model("Singer", singerSchema, "singer");
export default Singer;