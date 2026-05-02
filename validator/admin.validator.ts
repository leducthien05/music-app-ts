import { Request, Response, NextFunction } from "express";

export const createSong = (req: Request, res: Response, next: NextFunction) => {
    if(req.body.nameSong == ""){
        req.flash("error", "Tên bài hát không được để trống!");
        return res.redirect(req.get("referer") || "/admin/songs");
    }
    next();
}  

export const createSinger = (req: Request, res: Response, next: NextFunction) => {
    if(req.body.nameSong == ""){
        req.flash("error", "Tên ca sĩ không được để trống!");
        return res.redirect(req.get("referer") || "/admin/singers");
    }
    next();
}  


export const createTopic = (req: Request, res: Response, next: NextFunction) => {
    if(req.body.title == ""){
        req.flash("error", "Tiêu đề không được để trống!");
        return res.redirect(req.get("referer") || "/admin/topics");
    }
    next();
}  

export const createAccount = (req: Request, res: Response, next: NextFunction) => {
    if(req.body.fullName == ""){
        req.flash("error", "Họ tên không được để trống!");
        return res.redirect(req.get("referer") || "/admin/accounts");
    }
    if(req.body.email == ""){
        req.flash("error", "Email không được để trống!");
        return res.redirect(req.get("referer") || "/admin/accounts");
    }
    if(req.body.password == ""){
        req.flash("error", "Mật khẩu không được để trống!");
        return res.redirect(req.get("referer") || "/admin/accounts");
    }
    next();
}  


