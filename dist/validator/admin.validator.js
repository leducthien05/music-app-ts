"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTopic = exports.createSinger = exports.createSong = void 0;
const createSong = (req, res, next) => {
    if (req.body.nameSong == "") {
        req.flash("error", "Tên bài hát không được để trống!");
        return res.redirect(req.get("referer") || "/admin/songs");
    }
    next();
};
exports.createSong = createSong;
const createSinger = (req, res, next) => {
    if (req.body.nameSong == "") {
        req.flash("error", "Tên ca sĩ không được để trống!");
        return res.redirect(req.get("referer") || "/admin/singers");
    }
    next();
};
exports.createSinger = createSinger;
const createTopic = (req, res, next) => {
    if (req.body.title == "") {
        req.flash("error", "Tiêu đề không được để trống!");
        return res.redirect(req.get("referer") || "/admin/topics");
    }
    next();
};
exports.createTopic = createTopic;
