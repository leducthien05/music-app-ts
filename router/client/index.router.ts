import { Express } from "express";
import { RouterTopic } from "./topic.router";
import { RouterSong } from "./song.router";

export const  indexRouter = (app: Express) =>{
    app.use("/topics", RouterTopic);
    app.use("/songs", RouterSong);

}