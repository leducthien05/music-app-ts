import { Express } from "express";
import { RouterTopic } from "./topic.router";
import { RouterSong } from "./song.router";
import { userRouter } from "./user.router";

import {userMiddleware} from "../../middleware/client/user.middleware";
export const  indexRouter = (app: Express) =>{
    app.use(userMiddleware);
    app.use("/topics", RouterTopic);
    app.use("/songs", RouterSong);
    app.use("/users", userRouter);
}