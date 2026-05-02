import { Request, Response } from "express";

import Account from "../../model/account.model";

import * as passwordHelper from "../../helper/password";
import { systemConfig } from "../../config/system";

// [GET] /admin/auth/login
export const login = async (req: Request, res: Response) => {
    res.render("admin/page/auth/login", {
        titlePage: "Đăng nhập"
    });
}

// [POST]/admin/auth/login
export const loginPost = async (req: Request, res: Response) => {
    const existEmail = await Account.findOne({
        email: req.body.email,
        deleted: false,
        status: "active"
    });
    if(!existEmail){
        return res.redirect(req.get("referer"));
    }
    const isPassword = await passwordHelper.comparePassword(req.body.password, existEmail.password);
    if(!isPassword){
        return res.redirect(req.get("referer"));
    }
    res.cookie("token", existEmail.token);
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
}

// [GET] /admin/auth/logout
export const logout = async (req: Request, res: Response) => {
    res.clearCookie("token");
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
}