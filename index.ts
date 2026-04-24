import express, { Express } from "express";
import dotenv from "dotenv";
import * as database from "./config/database";

dotenv.config();
const app: Express = express();
const port: number | string = process.env.PORT || 8000;
// connect Database
database.connect();

// boy parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie parser
import cookieParser from "cookie-parser";
app.use(cookieParser());

import session from "express-session";
import flash from "express-flash";

// session
app.use(session({
  secret: "secret-key",
  resave: false,
  saveUninitialized: true
}));
declare global {
  namespace Express {
    interface Request {
      flash(type: string, message: string): void;
    }
  }
}
// flash
app.use(flash());

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
