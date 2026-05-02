import { Express } from "express";
import { systemConfig } from "../../config/system";

import { RouterDashboard } from "./dashboard.router";
import { RouterTopic } from "./topic.router";
import { RouterSong } from "./song.router";
import { RouterUpload } from "./upload.router";
import { RouterSinger } from "./singer.router";
import { RouterUser } from "./user.router";
import { RouterAccount } from "./account.router";
import { RouterRole } from "./role.router";
import { RouterAuth } from "./auth.router";

import { authLogin } from "../../middleware/admin/auth.middleware";

export const indexRouterAdmin = (app: Express) =>{
    app.use(`${systemConfig.prefixAdmin}/dashboard`, authLogin, RouterDashboard);
    app.use(`${systemConfig.prefixAdmin}/topics`, authLogin, RouterTopic);
    app.use(`${systemConfig.prefixAdmin}/songs`, authLogin, RouterSong);
    app.use(`${systemConfig.prefixAdmin}/upload`, authLogin, RouterUpload);
    app.use(`${systemConfig.prefixAdmin}/singers`, authLogin, RouterSinger);
    app.use(`${systemConfig.prefixAdmin}/users`, authLogin, RouterUser);
    app.use(`${systemConfig.prefixAdmin}/accounts`, authLogin, RouterAccount);
    app.use(`${systemConfig.prefixAdmin}/roles`, authLogin, RouterRole);
    app.use(`${systemConfig.prefixAdmin}/auth`, RouterAuth);
}