import { Request, Response, NextFunction } from "express";
import User from "../../model/user.model";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.cookies.tokenUser) {
        return res.redirect("/users/login");
    }
    else {

        const tokenUser = req.cookies.tokenUser;
        if (!tokenUser) {
            return res.redirect("/users/login");
        }
        const user = await User.findOne({ tokenUser, deleted: false });
        if (!user) {
            return res.redirect("/users/login");
        }
        req["user"] = user;
        next();
    }
}