import { Request, Response } from "express";

import Topic from "../../model/topics.model";
import Song from "../../model/song.model";
import Singer from "../../model/singer.model";

// [GET] /admin/topic
export const index = async (req: Request, res: Response)=>{
    const topic = await Topic.find({
        deleted: false
    });
    const song = await Song.find({
        deleted: false,
    });
    const idSinger = song.map(item => item.singer_id);
    const idSingerUnique = [... new Set(idSinger)];
    const singer = await Singer.find({
        deleted: false,
        _id: {$in: idSingerUnique}
    });
    const singerMap = {};
    singer.forEach(item=>{
        singerMap[item._id.toString()] = item.nameSinger ; 
    });
    song.forEach(item=>{
        item["nameSinger"] = singerMap[item.singer_id.toString()];
    });
    res.render("admin/page/song/index", {
        titlePage: "Thể loại",
        songs: song
    });
}