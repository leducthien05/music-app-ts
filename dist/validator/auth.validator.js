"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.getOTP = exports.forgotPassword = exports.register = exports.login = void 0;
const login = (req, res, next) => {
    if (!req.body.email) {
        req.flash("error", "Email không được để trống!");
        return res.redirect("/users/login");
    }
    if (!req.body.password) {
        req.flash("error", "Mật khẩu không được để trống!");
        return res.redirect("/users/login");
    }
    next();
};
exports.login = login;
const register = (req, res, next) => {
    if (!req.body.fullName) {
        req.flash("error", "Tên người dùng không được để trống!");
        return res.redirect("/users/register");
    }
    if (!req.body.email) {
        req.flash("error", "Email không được để trống!");
        return res.redirect("/users/register");
    }
    if (!req.body.password) {
        req.flash("error", "Mật khẩu không được để trống!");
        return res.redirect("/users/register");
    }
    next();
};
exports.register = register;
const forgotPassword = (req, res, next) => {
    if (!req.body.email) {
        req.flash("error", "Email không được để trống!");
        return res.redirect("/users/forgot-password");
    }
    next();
};
exports.forgotPassword = forgotPassword;
const getOTP = (req, res, next) => {
    if (!req.body.otp) {
        req.flash("error", "OTP không được để trống!");
        return res.redirect("/users/get-otp");
    }
    next();
};
exports.getOTP = getOTP;
const resetPassword = (req, res, next) => {
    if (!req.body.password) {
        req.flash("error", "Mật khẩu không được để trống!");
        return res.redirect("/users/reset-password");
    }
    if (!req.body.confirmPassword) {
        req.flash("error", "Xác nhận mật khẩu không được để trống!");
        return res.redirect("/users/reset-password");
    }
    if (req.body.password !== req.body.confirmPassword) {
        req.flash("error", "Mật khẩu và xác nhận mật khẩu không khớp!");
        return res.redirect("/users/reset-password");
    }
    if (!req.body.email) {
        req.flash("error", "Email không được để trống!");
        return res.redirect("/users/reset-password");
    }
    next();
};
exports.resetPassword = resetPassword;
