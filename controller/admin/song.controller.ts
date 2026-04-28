import { Request, Response } from "express";

import Topic from "../../model/topics.model";
import Song from "../../model/song.model";
import Singer from "../../model/singer.model";

import { systemConfig } from "../../config/system";

// [GET] /admin/songs
export const index = async (req: Request, res: Response) => {
    const song = await Song.find({
        deleted: false,
    });
    const idSinger = song.map(item => item.singer_id);
    const idSingerUnique = [... new Set(idSinger)];
    const singer = await Singer.find({
        deleted: false,
        _id: { $in: idSingerUnique }
    });
    const singerMap = {};
    singer.forEach(item => {
        singerMap[item._id.toString()] = item.nameSinger;
    });
    song.forEach(item => {
        item["nameSinger"] = singerMap[item.singer_id.toString()];
    });
    res.render("admin/page/song/index", {
        titlePage: "Thể loại",
        songs: song
    });
}

// [GET] /admin/songs/create
export const create = async (req: Request, res: Response) => {
    const singer = await Singer.find({
        deleted: false,
    });
    const topic = await Topic.find({
        deleted: false
    });
    res.render("admin/page/song/create", {
        titlePage: "Thêm bài hát mới",
        singer: singer,
        topic: topic
    });
}

// [POST] /admin/songs/create
export const createPost = async (req: Request, res: Response) => {
    const data = {
        nameSong: req.body.nameSong,
        singer_id: req.body.singer_id,
        avatar: req.body.avatar,
        description: req.body.description,
        topic_id: req.body.topic_id,
        releaseDate: req.body.releaseDate,
        status: "active",
    }
    const dataSong = new Song(data);
    await dataSong.save();
    res.redirect(`${systemConfig.prefixAdmin}/songs`);
}