import express, { Express } from "express";
import dotenv from "dotenv";
import * as database from "./config/database";

dotenv.config();
const app: Express = express();
const port: number | string = process.env.PORT || 8000;
// connect Database
database.connect();
// req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// method-override
import methodOverride from "method-override";
app.use(methodOverride("_method"));
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

// TinyMCE
import path from "path";
app.use("/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);

// flash
app.use(flash());

// Biến locals
import { systemConfig } from "./config/system";
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.set("views", "./view");
app.set("view engine", "pug");
// Cấu hình file tĩnh
app.use(express.static("public"));
// Router
import { indexRouter } from "./router/client/index.router";
import { indexRouterAdmin } from "./router/admin/index.router";
indexRouterAdmin(app);
indexRouter(app);

app.listen(port, () =>{
  console.log(`Đang nghe ở cổng ${port}`);
});
