"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.deleted = exports.changeStatus = exports.editPatch = exports.edit = exports.createPost = exports.create = exports.index = void 0;
const account_model_1 = __importDefault(require("../../model/account.model"));
const role_model_1 = __importDefault(require("../../model/role.model"));
const system_1 = require("../../config/system");
const search_1 = require("../../helper/search");
const pagination_1 = require("../../helper/pagination");
const filterStatus_1 = require("../../helper/filterStatus");
const passwordHelper = __importStar(require("../../helper/password"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const find = {
        deleted: false
    };
    const filter = (0, filterStatus_1.filterStatus)(req.query);
    if (req.query.status) {
        find["status"] = req.query.status;
    }
    const count = yield account_model_1.default.countDocuments(find);
    const objectPagination = (0, pagination_1.pagination)(req.query, count);
    const objectSearch = (0, search_1.search)(req.query);
    if (objectSearch.regex) {
        const fullName = objectSearch.regex;
        const textSlug = objectSearch.slug;
        find["$or"] = [
            { fullname: fullName },
            { slug: textSlug }
        ];
    }
    const account = yield account_model_1.default.find(find).skip(objectPagination.skip).limit(objectPagination.limit);
    res.render("admin/page/account/index", {
        titlePage: "Tài khoản",
        account: account,
        pagination: objectPagination,
        filterStatus: filter,
        keyword: objectSearch.keyword
    });
});
exports.index = index;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const role = yield role_model_1.default.find({
        deleted: false
    });
    res.render("admin/page/account/create", {
        titlePage: "Thêm tài khoản",
        role: role
    });
});
exports.create = create;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email.toString();
    const existEmail = yield account_model_1.default.findOne({
        deleted: false,
        email: email
    });
    if (existEmail) {
        return res.redirect(req.get("referer") || "/admin/accounts");
    }
    else {
        let avatar = "";
        if (req.body.avatar) {
            avatar = req.body.avatar;
        }
        ;
        const password = yield passwordHelper.hashPassword(req.body.password);
        const data = {
            fullName: req.body.fullName,
            avatar: avatar,
            email: email,
            password: password,
            role_id: req.body.role_id,
            status: "active",
        };
        const dataAccount = new account_model_1.default(data);
        yield dataAccount.save();
        res.redirect(`${system_1.systemConfig.prefixAdmin}/accounts`);
    }
});
exports.createPost = createPost;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idAccount = req.params.id.toString();
    const account = yield account_model_1.default.findOne({
        _id: idAccount,
        deleted: false
    });
    if (!account) {
        return res.redirect(req.get("referer"));
    }
    const role = yield role_model_1.default.find({
        deleted: false
    });
    res.render("admin/page/account/edit", {
        titlePage: "Chỉnh sửa tài khoản",
        account: account,
        role: role
    });
});
exports.edit = edit;
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idAccount = req.params.id.toString();
    console.log(req.body);
    const existEmail = yield account_model_1.default.findOne({
        _id: { $ne: idAccount },
        email: req.body.email,
        status: "active",
        deleted: false
    });
    if (existEmail) {
        return res.redirect(req.get("referer"));
    }
    ;
    const data = {
        fullName: req.body.fullName,
        email: req.body.email,
        status: "active",
    };
    let password;
    if (req.body.password) {
        password = yield passwordHelper.hashPassword(req.body.password);
        data["password"] = password;
    }
    if (req.body.avatar) {
        data["avatar"] = req.body.avatar;
    }
    if (req.body.role_id) {
        data["role_id"] = req.body.role_id;
    }
    yield account_model_1.default.updateOne({
        _id: idAccount
    }, data);
    res.redirect(`${system_1.systemConfig.prefixAdmin}/accounts`);
});
exports.editPatch = editPatch;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const status = req.params.status.toString();
    const id = req.params.id.toString();
    yield account_model_1.default.updateOne({
        _id: id
    }, {
        $set: {
            status: status
        }
    });
    res.json({
        code: 200,
        message: "Cập nhật thành công",
        status: status
    });
});
exports.changeStatus = changeStatus;
const deleted = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idAccount = req.params.id.toString();
    yield account_model_1.default.updateOne({
        _id: idAccount
    }, {
        $set: {
            deleted: true
        }
    });
    res.redirect(`${system_1.systemConfig.prefixAdmin}/accounts`);
});
exports.deleted = deleted;
