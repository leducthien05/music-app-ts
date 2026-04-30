"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexRouter = void 0;
const topic_router_1 = require("./topic.router");
const song_router_1 = require("./song.router");
const user_router_1 = require("./user.router");
const search_router_1 = require("./search.router");
const user_middleware_1 = require("../../middleware/client/user.middleware");
const indexRouter = (app) => {
    app.use(user_middleware_1.userMiddleware);
    app.use("/search", search_router_1.RouterResult);
    app.use("/topics", topic_router_1.RouterTopic);
    app.use("/songs", song_router_1.RouterSong);
    app.use("/users", user_router_1.userRouter);
};
exports.indexRouter = indexRouter;
