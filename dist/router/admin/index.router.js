"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexRouterAdmin = void 0;
const system_1 = require("../../config/system");
const dashboard_router_1 = require("./dashboard.router");
const topic_router_1 = require("./topic.router");
const song_router_1 = require("./song.router");
const upload_router_1 = require("./upload.router");
const indexRouterAdmin = (app) => {
    app.use(`${system_1.systemConfig.prefixAdmin}/dashboard`, dashboard_router_1.RouterDashboard);
    app.use(`${system_1.systemConfig.prefixAdmin}/topics`, topic_router_1.RouterTopic);
    app.use(`${system_1.systemConfig.prefixAdmin}/songs`, song_router_1.RouterSong);
    app.use(`${system_1.systemConfig.prefixAdmin}/upload`, upload_router_1.RouterUpload);
};
exports.indexRouterAdmin = indexRouterAdmin;
