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
    const idSinger = song.map(item =>{
        if(item.singer_id != ""){
            return item.singer_id;
        }
    });
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
    console.log(req.body)
    let avatar = "";
    let audio = "";
    if(req.body.avatar){
        avatar = req.body.avatar[0];
    }
    if(req.body.audio){
        audio = req.body.audio[0];
    }
    interface song {
        nameSong: string;
        singer_id ?: string;
        avatar ?: string;
        description ?: string;
        topic_id ?: string;
        releaseDate ?: string;
        audio ?: string;
        lyrics ?: string;
        status: string;
    };
    const data: song = {
        nameSong: req.body.nameSong,
        singer_id: req.body.singer_id,
        avatar: avatar,
        audio: audio,
        description: req.body.description,
        topic_id: req.body.topic_id,
        releaseDate: req.body.releaseDate,
        status: "active",
    }
    const dataSong = new Song(data);
    await dataSong.save();
    res.redirect(`${systemConfig.prefixAdmin}/songs`);
}

// [GET] /admin/songs/edit:id
export const edit = async (req: Request, res: Response) => {
    const idSong: string = req.params.id.toString();
    const song = await Song.findOne({
        _id: idSong
    });
    if(!song){
        return res.redirect(req.get("referer") || "/");
    }
    const singer = await Singer.find({
        deleted: false,
    });
    const topic = await Topic.find({
        deleted: false
    });
    res.render("admin/page/song/edit", {
        titlePage: "Chỉnh sửa bài hát",
        song: song,
        singer: singer,
        topic: topic
    });
}

// [PATCH] /admin/songs/edit:id
export const editPatch = async (req: Request, res: Response) => {
    console.log(req.body)
    const idSong: string = req.params.id.toString();
    interface song {
        nameSong: string;
        singer_id ?: string;
        avatar ?: string;
        description ?: string;
        topic_id ?: string;
        releaseDate ?: string;
        audio ?: string;
        lyrics ?: string;
        status: string;
    };
    const data: song = {
        nameSong: req.body.nameSong,
        singer_id: req.body.singer_id,
        description: req.body.description,
        topic_id: req.body.topic_id,
        releaseDate: req.body.releaseDate,
        status: "active",
        lyrics: req.body.lyrics
    }
    if(req.body.audio){
        data["audio"] = req.body.audio[0];
    }
    if(req.body.avatar){
        data["avatar"] = req.body.avatar[0];
    }
    await Song.updateOne({
        _id: idSong
    }, data);
    res.redirect(`${systemConfig.prefixAdmin}/songs`);
}