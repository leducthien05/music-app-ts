import { Express } from "express";
import { RouterTopic } from "./topic.router";

export const  indexRouter = (app: Express) =>{
    app.use("/topics", RouterTopic);
}