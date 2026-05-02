import { Request, Response, NextFunction } from "express";

import Account from "../../model/account.model";
import Role from "../../model/role.model";
import { systemConfig } from "../../config/system";

export const authLogin = async (req: Request, res: Response, next: NextFunction) => {
    if (req.cookies.token) {
        const account = await Account.findOne({
            token: req.cookies.token
        }).select("-password");
        if (!account) {
            req.flash("warning", "Tài khoản đã bị khóa  ");
            return res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
        } else {
            const role = await Role.findOne({
                _id: account.role_id,
                status: "active",
                deleted: false
            });
            if (role) {
                res.locals.accountAdmin = account;
                res.locals.roleAccount = role;
                next();
            }else{
                next();
            }
            
        }
    } else {
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    }
}