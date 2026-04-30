import { Express } from "express";
import { systemConfig } from "../../config/system";

import { RouterDashboard } from "./dashboard.router";
import { RouterTopic } from "./topic.router";
import { RouterSong } from "./song.router";
import { RouterUpload } from "./upload.router";

export const indexRouterAdmin = (app: Express) =>{
    app.use(`${systemConfig.prefixAdmin}/dashboard`, RouterDashboard);
    app.use(`${systemConfig.prefixAdmin}/topics`, RouterTopic);
    app.use(`${systemConfig.prefixAdmin}/songs`, RouterSong);
    app.use(`${systemConfig.prefixAdmin}/upload`, RouterUpload)
}