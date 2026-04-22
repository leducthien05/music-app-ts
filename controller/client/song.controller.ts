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
        const topic_slug = req.params.slugTopic;
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

