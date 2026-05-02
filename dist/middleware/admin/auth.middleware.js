"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authLogin = void 0;
const account_model_1 = __importDefault(require("../../model/account.model"));
const role_model_1 = __importDefault(require("../../model/role.model"));
const system_1 = require("../../config/system");
const authLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.cookies.token) {
        const account = yield account_model_1.default.findOne({
            token: req.cookies.token
        }).select("-password");
        if (!account) {
            req.flash("warning", "Tài khoản đã bị khóa  ");
            return res.redirect(`${system_1.systemConfig.prefixAdmin}/auth/login`);
        }
        else {
            const role = yield role_model_1.default.findOne({
                _id: account.role_id,
                status: "active",
                deleted: false
            });
            if (role) {
                res.locals.accountAdmin = account;
                res.locals.roleAccount = role;
                next();
            }
            else {
                next();
            }
        }
    }
    else {
        res.redirect(`${system_1.systemConfig.prefixAdmin}/auth/login`);
    }
});
exports.authLogin = authLogin;
