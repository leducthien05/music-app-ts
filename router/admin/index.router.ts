import { Express } from "express";
import { systemConfig } from "../../config/system";

import { RouterDashboard } from "./dashboard.router";

export const indexRouterAdmin = (app: Express) =>{
    app.use(`${systemConfig.prefixAdmin}/dashboard`, RouterDashboard);
}