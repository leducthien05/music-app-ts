import { Request, Response } from "express";

import Song from "../../model/song.model";
import Topic from "../../model/topics.model";
import Singer from "../../model/singer.model";

// [GET] /songs
export const index = async (req: Request, res: Response) => {
    const song = await Song.find({
        deleted: false,
        status: "active"
    });
    console.log("OK");
}

// [GET] /songs/:slugTopic
export const listByTopic = async (req: Request, res: Response) => {
    try {
        const topic_slug: string = req.params.slugTopic.toString() || "";
        const topic = await Topic.findOne({
            deleted: false,
            status: "active",
            slug: topic_slug
        });
        const songs = await Song.find({
            deleted: false,
            status: "active",
            topic_id: topic.id
        }).select("nameSong singer_id avatar like slug").lean();
        for (const item of songs) {
            const infoSinger = await Singer.findOne({
                deleted: false,
                status: "active",
                _id: item.singer_id
            });
            if (!infoSinger) {
                return;
            } else {
                item["infoSinger"] = infoSinger;

            }
        }

        res.render("client/page/song/list", {
            titlePage: topic.title,
            topic: topic,
            songs: songs
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
}

// [GET] /songs/detail/:slugSong
export const detail = async (req: Request, res: Response) => {
    try {
        const song_slug: string = req.params.slugSong.toString() || "";
        const song = await Song.findOne({
            deleted: false,
            status: "active",
            slug: song_slug
        }).select("nameSong avatar audio singer_id topic_id");
        if (!song) {
            return res.status(404).send("Song not found");
        }
        const singer = await Singer.findOne({
            deleted: false,
            status: "active",   
            _id: song.singer_id
        }).select("nameSinger slug");
        const topic = await Topic.findOne({
            deleted: false,
            status: "active",
            _id: song.topic_id
        }).select("title slug");
        res.render("client/page/song/detail", {
            titlePage: song.nameSong,
            song: song,
            singer: singer,
            topic: topic
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
}

