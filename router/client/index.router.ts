import { Express } from "express";
import { RouterTopic } from "./topic.router";
import { RouterSong } from "./song.router";
import { RouterUser } from "./user.router";
import { RouterResult } from "./search.router";
import { RouterHome } from "./home.router";

import {userMiddleware} from "../../middleware/client/user.middleware";
export const  indexRouter = (app: Express) =>{
    app.use(userMiddleware);
    app.use("/", RouterHome);
    app.use("/search", RouterResult);
    app.use("/topics", RouterTopic);
    app.use("/songs", RouterSong);
    app.use("/users", RouterUser);
}