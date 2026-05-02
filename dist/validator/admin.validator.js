"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.editAccount = exports.createAccount = exports.createTopic = exports.createSinger = exports.createSong = void 0;
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
const createAccount = (req, res, next) => {
    if (req.body.fullName == "") {
        req.flash("error", "Họ tên không được để trống!");
        return res.redirect(req.get("referer") || "/admin/accounts");
    }
    if (req.body.email == "") {
        req.flash("error", "Email không được để trống!");
        return res.redirect(req.get("referer") || "/admin/accounts");
    }
    if (req.body.password == "") {
        req.flash("error", "Mật khẩu không được để trống!");
        return res.redirect(req.get("referer") || "/admin/accounts");
    }
    next();
};
exports.createAccount = createAccount;
const editAccount = (req, res, next) => {
    if (req.body.fullName == "") {
        req.flash("error", "Họ tên không được để trống!");
        return res.redirect(req.get("referer") || "/admin/accounts");
    }
    if (req.body.email == "") {
        req.flash("error", "Email không được để trống!");
        return res.redirect(req.get("referer") || "/admin/accounts");
    }
    next();
};
exports.editAccount = editAccount;
const login = (req, res, next) => {
    if (req.body.email == "") {
        req.flash("error", "Email không được để trống!");
        return res.redirect(req.get("referer"));
    }
    if (req.body.password == "") {
        req.flash("error", "Mật khẩu không được để trống!");
        return res.redirect(req.get("referer"));
    }
    next();
};
exports.login = login;
