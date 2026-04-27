import { Request, Response } from "express";

import Song from "../../model/song.model";

// [GET] /admin/dashboard
export const dashboard = async (req: Request, res: Response)=>{
    const song = await Song.find({
        deleted:false
    });
    res.render("admin/page/dashboard/index", {
        titlePage: "Dashboard",
        songs: song
    });
}