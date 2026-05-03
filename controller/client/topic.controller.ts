import { Request, Response } from "express";
import Topic from "../../model/topics.model";
import Song from "../../model/song.model";
import Singer from "../../model/singer.model";

// [GET] /topics
export const index = async (req: Request, res: Response) => {
    const topic = await Topic.find({
        deleted: false,
        status: "active"
    }).limit(6);
    res.render("client/page/topics/index", {
        titlePage: "Thể loại nhạc",
        topic: topic
    });
}

// [GET] /topics/:slugTopic
export const listByTopic = async (req: Request, res: Response) => {
    try {
        const topic_slug: string = req.params.slug.toString() || "";
        const topic = await Topic.findOne({
            deleted: false,
            status: "active",
            slug: topic_slug
        });
        console.log(topic)
        const id = topic.id.toString();
        const songs = await Song.find({
            deleted: false,
            status: "active",
            topic_id: id
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

        res.render("client/page/topics/list", {
            titlePage: topic.title,
            topic: topic,
            songs: songs
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
}
