import express, { Express, Request, Response } from "express";

const app: Express = express();
const port: number = 8000;

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
