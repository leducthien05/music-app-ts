import { Request, Response, NextFunction } from "express";

export const login = (req: Request, res: Response, next: NextFunction) => {
    if(!req.body.email){
        req.flash("error", "Email không được để trống!");
        return res.redirect("/users/login");
    }
    if(!req.body.password){
        req.flash("error", "Mật khẩu không được để trống!");
        return res.redirect("/users/login");
    }
    next();
}   

export const register = (req: Request, res: Response, next: NextFunction) => {
    if(!req.body.fullName){
        req.flash("error", "Tên người dùng không được để trống!");
        return res.redirect("/users/register");
    }
    if(!req.body.email){
        req.flash("error", "Email không được để trống!");
        return res.redirect("/users/register");
    }
    if(!req.body.password){
        req.flash("error", "Mật khẩu không được để trống!");
        return res.redirect("/users/register");
    }
    next();
}

export const forgotPassword = (req: Request, res: Response, next: NextFunction) => {
    if(!req.body.email){
        req.flash("error", "Email không được để trống!");
        return res.redirect("/users/forgot-password");
    }
    next();
}

export const getOTP = (req: Request, res: Response, next: NextFunction) => {
    if(!req.body.otp){
        req.flash("error", "OTP không được để trống!");
        return res.redirect("/users/get-otp");
    }
    next();
}

export const resetPassword = (req: Request, res: Response, next: NextFunction) => {
    if(!req.body.password){
        req.flash("error", "Mật khẩu không được để trống!");
        return res.redirect("/users/reset-password");
    }
    if(!req.body.confirmPassword){
        req.flash("error", "Xác nhận mật khẩu không được để trống!");
        return res.redirect("/users/reset-password");
    }
    if(req.body.password !== req.body.confirmPassword){
        req.flash("error", "Mật khẩu và xác nhận mật khẩu không khớp!");
        return res.redirect("/users/reset-password");
    }
    if(!req.body.email){
        req.flash("error", "Email không được để trống!");
        return res.redirect("/users/reset-password");
    }
    next();
}
