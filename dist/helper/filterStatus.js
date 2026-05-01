"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterStatus = void 0;
const filterStatus = (query) => {
    const listStatus = [
        {
            name: "Tất cả",
            class: "active",
            status: ""
        },
        {
            name: "Hoạt động",
            status: "active",
            class: ""
        },
        {
            name: "Tạm ẩn",
            status: "inactive",
            class: ""
        }
    ];
    if (query.status) {
        listStatus.forEach(item => {
            (item.status === query.status) ? item.class = "active" : item.class = "";
            return;
        });
    }
    return listStatus;
};
exports.filterStatus = filterStatus;
