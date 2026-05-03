import { Request, Response } from "express";
import User from "../../model/user.model";
import OTP from "../../model/otp.model";

import { hashPassword, comparePassword } from "../../helper/password";
import { generateOTP } from "../../helper/generate";
import { sendMail } from "../../helper/sendmail";

// [GET] /users/login
export const login = async (req: Request, res: Response) => {
    res.render("client/page/auth/login", {
        titlePage: "Login",
    });
    // Login logic here
};
// [POST] /users/login
export const loginPost = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, deleted: false });
    if (!user) {
        req.flash("error", "Email hoặc mật khẩu không đúng!");
        return res.redirect("/users/login");
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        req.flash("error", "Email hoặc mật khẩu không đúng!");
        return res.redirect("/users/login");
    }
    res.cookie("tokenUser", user.tokenUser);
    req.flash("success", "Đăng nhập thành công!");
    res.redirect("/songs");
};
// [GET] /users/register
export const register = async (req: Request, res: Response) => {
    res.render("client/page/auth/register", {
        titlePage: "Register",
    });
    // Register logic here
};
// [POST] /users/register
export const registerPost = async (req: Request, res: Response) => {
    const existUser = await User.findOne({
        email: req.body.email,
        deleted: false
    });
    if (existUser) {
        req.flash("error", "Email đã tồn tại!");
        return res.redirect("/users/register");
    }
    const hashedPassword = await hashPassword(req.body.password);

    const newUser = new User({
        fullName: req.body.fullName,
        email: req.body.email,
        password: hashedPassword,
        phone: req.body.phone
    });
    await newUser.save();
    res.cookie("tokenUser", newUser.tokenUser);
    req.flash("success", "Đăng ký thành công!");
    res.redirect("/songs");
}
// [GET] /users/forgot-password
export const forgotPassword = async (req: Request, res: Response) => {
    res.render("client/page/auth/forgot-password", {
        titlePage: "Forgot Password",
    });
    // Forgot password logic here
};
// [POST] /users/forgot-password
export const forgotPasswordPost = async (req: Request, res: Response) => {
    const email: string = req.body.email.toString() || "";
    const user = await User.findOne({ email, deleted: false });
    if (!user) {
        req.flash("error", "Email không tồn tại!");
        return res.redirect("/users/forgot-password");
    }   
    
    const otp = generateOTP();
    const otpDoc = new OTP({
        email: user.email,
        otp: otp,
        expiresAt: new Date()
    });
    await otpDoc.save();
    // Gửi email chứa OTP đến người dùng (có thể sử dụng thư viện như nodemailer)
    const subject = "Mã OTP đặt lại mật khẩu";
    const html = ` <p>Mã OTP của bạn là: <strong>${otp}</strong></p>
                    <p>Mã OTP này sẽ hết hạn sau 3 phút.</p>`;
    // Gửi email
    sendMail(email, subject, html);
    res.redirect("/users/get-otp?email=" + email);
}
// [GET] /users/get-otp
export const getOTP = async (req: Request, res: Response) => {
    const email: string = req.query.email.toString() || "";
    res.render("client/page/auth/get-otp", {
        titlePage: "Nhập OTP",
        email: email
    });
}
// [POST] /users/get-otp
export const getOTPPost = async (req: Request, res: Response) => {
    const email: string = req.body.email.toString() || "";
    const otp: string = req.body.otp.toString() || "";
    const otpDoc = await OTP.findOne({ 
        email: email,
        otp: otp
    });
    if (!otpDoc) {
        req.flash("error", "Mã OTP không đúng!");
        return res.redirect("/users/get-otp?email=" + email);
    }
    res.redirect("/users/reset-password?email=" + email);
}
// [GET] /users/reset-password
export const resetPassword = async (req: Request, res: Response) => {
    const email: string = req.query.email.toString() || "";
    res.render("client/page/auth/reset-password", {
        titlePage: "Đặt lại mật khẩu",
        email: email
    });
}
// [POST] /users/reset-password
export const resetPasswordPost = async (req: Request, res: Response) => {
    const email: string = req.body.email.toString() || "";
    const newPassword: string = req.body.password.toString() || "";
    const user = await User.findOne({ email, deleted: false });
    if (!user) {
        req.flash("error", "Email không tồn tại!");
        return res.redirect("/users/reset-password?email=" + email);
    }
    const hashedPassword = await hashPassword(newPassword);
    await User.updateOne({ 
        email 
    }, { 
        $set: {
            password: hashedPassword
        }
    });

    req.flash("success", "Đặt lại mật khẩu thành công!");
    res.redirect("/users/login");
}
// [GET] /users/logout
export const logout = async (req: Request, res: Response) => {
    res.clearCookie("tokenUser");
    req.flash("success", "Đăng xuất thành công!");
    res.redirect("/");
}

