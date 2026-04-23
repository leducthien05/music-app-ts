import express, { Express } from "express";
import dotenv from "dotenv";
import * as database from "./config/database";

dotenv.config();
const app: Express = express();
const port: number | string = process.env.PORT || 8000;
// connect Database
database.connect();

app.set("views", "./view");
app.set("view engine", "pug");
// Cấu hình file tĩnh
app.use(express.static("public"));
// Router
import { indexRouter } from "./router/client/index.router";
indexRouter(app);

app.listen(port, () =>{
    console.log(`Đang nghe ở cổng ${port}`);
});
