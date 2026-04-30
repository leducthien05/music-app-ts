"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSong = void 0;
const createSong = (req, res, next) => {
    if (req.body.nameSong == "") {
        req.flash("error", "Tên bài hát không được để trống!");
        return res.redirect(req.get("referer") || "/admin/songs");
    }
    next();
};
exports.createSong = createSong;
