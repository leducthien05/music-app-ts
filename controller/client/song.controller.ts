import { Request, Response } from "express";

import Song from "../../model/song.model";
import Topic from "../../model/topics.model";
import Singer from "../../model/singer.model";
import Favorite from "../../model/song-favorite.model";

// [GET] /songs
export const index = async (req: Request, res: Response) => {
    const song = await Song.find({
        deleted: false,
        status: "active"
    });
    console.log("OK");
    res.render("client/page/song/index", {
        titlePage: "Songs",
        songs: song
    });
}

// [GET] /songs/topics/:slugTopic
export const listByTopic = async (req: Request, res: Response) => {
    try {
        const topic_slug: string = req.params.slugTopic.toString() || "";
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
    // Lấy slug bài hát
    const song_slug: string = req.params.slugSong.toString() || "";
    
    // Lấy bài hát
    const song = await Song.findOne({
        deleted: false,
        status: "active",
        slug: song_slug
    }).select("nameSong avatar audio singer_id topic_id like");
    if (!song) {
        return res.status(404).send("Song not found");
    }
    // Kiểm tra người dùng đã like bài này chưa
    const isLike = await Song.findOne({
        deleted: false,
        status: "active",
        slug: song_slug,
        "like.user_id": res.locals.user.id
    });
    let liked = "0";
    if (isLike) {
        liked = "1"
    }
    // Kiểm tra xem người dùng đã yêu thích bài hát này chưa
    const isFavorite = await Favorite.findOne({
        deleted: false,
        user_id: res.locals.user.id,
        song_id: song.id
    });
    let favorite = "0";
    if (isFavorite) {
        favorite = "1"
    }
    // Lấy ca sĩ bài hát này
    const singer = await Singer.findOne({
        deleted: false,
        status: "active",
        _id: song.singer_id
    }).select("nameSinger slug");
    // Lấy chủ đề bài hát này
    const topic = await Topic.findOne({
        deleted: false,
        status: "active",
        _id: song.topic_id
    }).select("title slug");
    // Trả data cho giao diện
    res.render("client/page/song/detail", {
        titlePage: song.nameSong,
        song: song,
        singer: singer,
        topic: topic,
        liked: liked,
        favorite: favorite
    });
}

// [PATCH] /songs/like/:action/:id
export const like = async (req: Request, res: Response) => {
    try {
        const idUser: string = res.locals.user.id; // Thay thế bằng ID của người dùng thực tế
        const song_id: string = req.params.id.toString() || "";
        const action: string = req.params.action.toString() || "";

        const song = await Song.findOne({
            deleted: false,
            status: "active",
            _id: song_id
        });
        if (!song) {
            return res.status(404).send("Song not found");
        }
        if (action === "yes") {
            await Song.updateOne({
                deleted: false,
                status: "active",
                _id: song_id,
                "like.user_id": { $ne: res.locals.user.id }
            }, {
                $push: {
                    like: {
                        user_id: idUser,
                        createdAt: Date.now()
                    }
                }
            });
        } else {
            await Song.updateOne({
                deleted: false,
                status: "active",
                _id: song_id,
                "like.user_id": idUser
            }, {
                $pull: {
                    like: {
                        user_id: idUser,
                    }
                }
            });
        }
        // 🔥 Lấy lại số lượng like
        const updatedSong = await Song.findById(song_id);
        res.json({
            code: 200,
            message: "Liked successfully",
            likeCount: updatedSong.like.length
        })

    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
}

// [POST] /songs/favorite/:action/:id
export const favorite = async (req: Request, res: Response) => {
    try {
        const idUser: string = res.locals.user.id; // Thay thế bằng ID của người dùng thực tế
        const song_id: string = req.params.id.toString() || "";
        const action: string = req.params.action.toString() || "";
        if (action == "yes") {
            // 🔥 check đã tồn tại chưa
            const exist = await Favorite.findOne({ 
                song_id: song_id, 
                user_id: idUser 
            });

            if (exist) {
                return res.json({
                    code: 200,
                    message: "Favorite successfully"
                });
            }
            const isFavorite = new Favorite({
                song_id: song_id,
                user_id: idUser,
            });
            await isFavorite.save();
            res.json({
                code: 200,
                message: "Favorite successfully"
            });
        } else {
            await Favorite.deleteOne({
                song_id: song_id,
                user_id: idUser
            });
            res.json({
                code: 200,
                message: "Unfavorite successfully"
            });

        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
}

// [GET] /songs/favorite-songs
export const listFavorite = async (req: Request, res: Response) => {
    const idUser: string = res.locals.user._id; // Thay thế bằng ID của người dùng thực tế
    const favoriteSongs = await Favorite.find({
        user_id: idUser,
        deleted: false
    });
    for (const item of favoriteSongs) {
        const infoSong = await Song.findOne({
            _id: item.song_id
        });
        const infoSinger = await Singer.findOne({
            _id: infoSong.singer_id
        });
        item["infoSong"] = infoSong;
        item["infoSinger"] = infoSinger;
    }
    res.render("client/page/song/favorite-song", {
        titlePage: "Nhạc yêu thích của bạn",
        favorite: favoriteSongs
    });

}
