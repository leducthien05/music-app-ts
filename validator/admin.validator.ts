import { Request, Response, NextFunction } from "express";

export const createSong = (req: Request, res: Response, next: NextFunction) => {
    if(req.body.nameSong == ""){
        req.flash("error", "Tên bài hát không được để trống!");
        return res.redirect(req.get("referer") || "/admin/songs");
    }
    next();
}   

