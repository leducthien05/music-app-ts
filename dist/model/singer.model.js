"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const singerSchema = new mongoose_1.default.Schema({
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
}, {
    timestamps: true
});
const Singer = mongoose_1.default.model("Singer", singerSchema, "singer");
exports.default = Singer;
