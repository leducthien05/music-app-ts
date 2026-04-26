import { Request, Response } from "express";
import Song from "../../model/song.model";
import Singer from "../../model/singer.model";
import Topic from "../../model/topics.model";
import Favorite from "../../model/song-favorite.model";

import { convertToSlug } from "../../helper/convertToSlug";

// [GET] /search
export const index = async (req: Request, res: Response) => {
    res.render("client/page/search/index", {
        titlePage: "Tìm kiếm"
    });
}

// [GET] /search/result
export const result = async (req: Request, res: Response) => {
    const keyword: string = req.query.keyword.toString();
    let result = [];
    let favorite = "0";
    if (req.query.keyword) {
        const nameSong = new RegExp(keyword, "i");
        // Chuyển sang slug
        const textSearch = convertToSlug(keyword);
        const textSearchSlug = new RegExp(textSearch, "i")
        const songs = await Song.find({
            deleted: false,
            $or: [
                { slug: textSearchSlug },
                { nameSong: nameSong }
            ]

        });
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
                let favorite = "0";
                if (isFavorite) {
                    favorite = "1"
                }
            }

        }
        result = songs;
    }
    res.render("client/page/search/index", {
        titlePage: "Tìm kiếm",
        keyword: keyword,
        songs: result,
        favorite: favorite
    });
}

// [GET] /search/suggest
export const suggest = async (req: Request, res: Response) => {
    const keyword: string = req.query.keyword.toString();
    let result = [];
    if (keyword) {
        const nameSong = new RegExp(keyword, "i");
        // Chuyển sang slug
        const textSearch = convertToSlug(keyword);
        const textSearchSlug = new RegExp(textSearch, "i")
        const songs = await Song.find({
            deleted: false,
            $or: [
                { slug: textSearchSlug },
                { nameSong: nameSong }
            ]

        });
        for (const item of songs) {
            const infoSinger = await Singer.findOne({
                deleted: false,
                _id: item.singer_id
            });
            result.push({
                id: item.id,
                nameSong: item.nameSong,
                avatar: item.avatar,
                description: item.description,
                like: item.like,
                infoSinger: infoSinger
            });
        }
    }
    res.json({
        code: 200,
        result: result
    });
}