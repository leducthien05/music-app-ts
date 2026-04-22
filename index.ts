import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import * as database from "./config/database";

dotenv.config();
const app: Express = express();
const port: number | string = process.env.PORT || 8000;
// connect Database
database.connect();

app.set("views", "./view");
app.set("view engine", "pug");

app.get("/topics", (req: Request, res: Response)=>{
    res.render("client/page/topics/index", {
        titlePage: "Thể loại nhạc"
    });
});

app.listen(port, () =>{
    console.log(`Đang nghe ở cổng ${port}`);
});
