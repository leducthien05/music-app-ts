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
exports.logout = exports.resetPasswordPost = exports.resetPassword = exports.getOTPPost = exports.getOTP = exports.forgotPasswordPost = exports.forgotPassword = exports.registerPost = exports.register = exports.loginPost = exports.login = void 0;
const user_model_1 = __importDefault(require("../../model/user.model"));
const otp_model_1 = __importDefault(require("../../model/otp.model"));
const password_1 = require("../../helper/password");
const generate_1 = require("../../helper/generate");
const sendmail_1 = require("../../helper/sendmail");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("client/page/auth/login", {
        titlePage: "Login",
    });
});
exports.login = login;
const loginPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield user_model_1.default.findOne({ email, deleted: false });
    if (!user) {
        req.flash("error", "Email hoặc mật khẩu không đúng!");
        return res.redirect("/users/login");
    }
    const isMatch = yield (0, password_1.comparePassword)(password, user.password);
    if (!isMatch) {
        req.flash("error", "Email hoặc mật khẩu không đúng!");
        return res.redirect("/users/login");
    }
    res.cookie("tokenUser", user.tokenUser);
    req.flash("success", "Đăng nhập thành công!");
    res.redirect("/songs");
});
exports.loginPost = loginPost;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("client/page/auth/register", {
        titlePage: "Register",
    });
});
exports.register = register;
const registerPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const existUser = yield user_model_1.default.findOne({
        email: req.body.email,
        deleted: false
    });
    if (existUser) {
        req.flash("error", "Email đã tồn tại!");
        return res.redirect("/users/register");
    }
    const hashedPassword = yield (0, password_1.hashPassword)(req.body.password);
    const newUser = new user_model_1.default({
        fullName: req.body.fullName,
        email: req.body.email,
        password: hashedPassword,
        phone: req.body.phone
    });
    yield newUser.save();
    res.cookie("tokenUser", newUser.tokenUser);
    req.flash("success", "Đăng ký thành công!");
    res.redirect("/songs");
});
exports.registerPost = registerPost;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("client/page/auth/forgot-password", {
        titlePage: "Forgot Password",
    });
});
exports.forgotPassword = forgotPassword;
const forgotPasswordPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email.toString() || "";
    const user = yield user_model_1.default.findOne({ email, deleted: false });
    if (!user) {
        req.flash("error", "Email không tồn tại!");
        return res.redirect("/users/forgot-password");
    }
    const otp = (0, generate_1.generateOTP)();
    const otpDoc = new otp_model_1.default({
        email: user.email,
        otp: otp,
        expiresAt: new Date()
    });
    yield otpDoc.save();
    const subject = "Mã OTP đặt lại mật khẩu";
    const html = ` <p>Mã OTP của bạn là: <strong>${otp}</strong></p>
                    <p>Mã OTP này sẽ hết hạn sau 3 phút.</p>`;
    (0, sendmail_1.sendMail)(email, subject, html);
    res.redirect("/users/get-otp?email=" + email);
});
exports.forgotPasswordPost = forgotPasswordPost;
const getOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.query.email.toString() || "";
    res.render("client/page/auth/get-otp", {
        titlePage: "Nhập OTP",
        email: email
    });
});
exports.getOTP = getOTP;
const getOTPPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email.toString() || "";
    const otp = req.body.otp.toString() || "";
    const otpDoc = yield otp_model_1.default.findOne({
        email: email,
        otp: otp
    });
    if (!otpDoc) {
        req.flash("error", "Mã OTP không đúng!");
        return res.redirect("/users/get-otp?email=" + email);
    }
    res.redirect("/users/reset-password?email=" + email);
});
exports.getOTPPost = getOTPPost;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.query.email.toString() || "";
    res.render("client/page/auth/reset-password", {
        titlePage: "Đặt lại mật khẩu",
        email: email
    });
});
exports.resetPassword = resetPassword;
const resetPasswordPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email.toString() || "";
    const newPassword = req.body.password.toString() || "";
    const user = yield user_model_1.default.findOne({ email, deleted: false });
    if (!user) {
        req.flash("error", "Email không tồn tại!");
        return res.redirect("/users/reset-password?email=" + email);
    }
    const hashedPassword = yield (0, password_1.hashPassword)(newPassword);
    yield user_model_1.default.updateOne({
        email
    }, {
        $set: {
            password: hashedPassword
        }
    });
    req.flash("success", "Đặt lại mật khẩu thành công!");
    res.redirect("/users/login");
});
exports.resetPasswordPost = resetPasswordPost;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("tokenUser");
    req.flash("success", "Đăng xuất thành công!");
    res.redirect("/users/login");
});
exports.logout = logout;
