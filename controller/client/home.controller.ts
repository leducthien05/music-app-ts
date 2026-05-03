import { Request, Response } from "express";

import Song from "../../model/song.model";
import Topic from "../../model/topics.model";
import Singer from "../../model/singer.model";
import Favorite from "../../model/song-favorite.model";

// [GET] /
export const index = async (req: Request, res: Response) => {
    // Ca sĩ
    const singers = await Singer.find({
        deleted: false,
        status: "active"
    }).limit(6);
    const idSinger = singers.map(item => item.id);
    // Chủ đề
    const topics = await Topic.find({
        deleted: false,
        status: "active"
    }).limit(6);
    const idTopic = topics.map(item => item.id);
    // Bài hát
    const songs = await Song.find({
        deleted: false,
        status: "active",
        topic_id: {$in: idTopic},
        singer_id: {$in: idSinger}
    }).limit(10);
    let favorite = "0";
    for (const item of songs) {
        const infoSinger = await Singer.findOne({
            deleted: false,
            _id: item.singer_id
        });
        item["infoSinger"] = infoSinger;
        // Kiểm tra xem người dùng đã yêu thích bài hát này chưa

        if (res.locals.user) {
            const isFavorite = await Favorite.findOne({
                deleted: false,
                user_id: res.locals.user.id,
                song_id: item.id
            });

            if (isFavorite) {
                favorite = "1"
            }
        }

    }
    
    res.render("client/page/home/index", {
        titlePage: "Songs",
        songs: songs,
        singer: singers,
        topic: topics,
        favorite: favorite
    });
}
