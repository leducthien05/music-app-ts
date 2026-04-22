import express, { Express, Request, Response } from "express";

const app: Express = express();
const port: number = 8000;

app.get("/topics", (req: Request, res: Response)=>{
    res.send("Danh sách thể loại");
});

app.listen(port, () =>{
    console.log(`Đang nghe ở cổng ${port}`);
});
