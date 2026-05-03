import { Request, Response, NextFunction } from "express";
import User from "../../model/user.model";

export const userMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (req.cookies.tokenUser) {
        const tokenUser = req.cookies.tokenUser;
        const user = await User.findOne({ tokenUser, deleted: false }).select("-password");
        if (!user) {
            return res.redirect("/users/login");
        }
        req["user"] = user;
        res.locals.user = user;
    }
    next();
}