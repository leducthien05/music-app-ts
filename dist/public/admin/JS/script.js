// Phân trang
const pageLink = document.querySelectorAll(".page-link");
if (pageLink.length > 0) {
    pageLink.forEach(item => {
        let url = new URL(window.location.href);
        item.addEventListener("click", () => {
            const currentPage = item.getAttribute("number-page");
            if (currentPage) {
                url.searchParams.set("page", currentPage);
                window.location.href = url.href;
            }
        });
    });
}

// Thay đổi trạng thái
const btnStatus = document.querySelectorAll(".status");
if (btnStatus.length > 0) {
    btnStatus.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const path = document.querySelector("#form-get-path").getAttribute("action");
            const value = btn.getAttribute("status");
            const id = btn.getAttribute("id-status");
            const status = value == "active" ? "inactive" : "active";
            const link = `${path}/change-status/${status}/${id}`;
            fetch(link, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(res => res.json())
                .then((data) => {
                    if (data.code == 200) {
                        if (data.status == "active") {
                            btn.textContent = "Active";
                            btn.classList.remove("inactive");
                            btn.classList.add("active");
                            btn.setAttribute("status", "active");
                        } else {
                            btn.textContent = "Inactive";
                            btn.classList.remove("active");
                            btn.classList.add("inactive");
                            btn.setAttribute("status", "inactive");
                        }
                    }
                });
        });
    });
}

// Lọc theo trạng thái
const filterStatus = document.querySelectorAll(".tabs [status]");
if (filterStatus.length > 0) {
    let url = new URL(window.location.href);
    filterStatus.forEach(item => {
        item.addEventListener("click", (e) => {
            const status = item.getAttribute("status");
            if (status) {
                url.searchParams.set("status", status);
            } else {
                url.searchParams.delete("status");
            }
            window.location.href = url.href;
        });
    });
}

// Topic
const sortTopic = document.querySelector("#topic");
if (sortTopic) {
    const url = new URL(window.location.href);
    sortTopic.addEventListener("change", () => {
        const option = sortTopic.value;
        console.log(option)
        if (option) {
            url.searchParams.set("topic", option);
        }
        window.location.href = url.href;
    });
    const key = url.searchParams.get("topic");
    if (key) {
        const option = document.querySelector(`option[value='${key}']`);
        option.selected = true;
    }
}
// singer
const sortSinger = document.querySelector("#singer");
if (sortSinger) {
    const url = new URL(window.location.href);
    sortSinger.addEventListener("change", () => {
        const option = sortSinger.value;
        console.log(option)

        if (option) {
            url.searchParams.set("singer", option);
        }
        window.location.href = url.href;
    });
    const key = url.searchParams.get("singer");
    if (key) {
        const option = document.querySelector(`option[value='${key}']`);
        option.selected = true;
    }

}
const btnClear = document.querySelector("[btn-clear]");
if (btnClear) {
    const url = new URL(window.location.href);
    btnClear.addEventListener("click", () => {
        url.searchParams.delete("singer");
        url.searchParams.delete("topic");
        window.location.href = url.href;
    });
}

// Xóa
const formDelte = document.querySelector("#form-delete");
if (formDelte) {
    const path = formDelte.action;

    const btnDelete = document.querySelectorAll("[btn-delete]");
    if (btnDelete.length > 0) {
        btnDelete.forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                const action = `${path}/${id}?_method=DELETE`;
                formDelte.action = action;
                formDelte.submit();
            });
        });

    }

}
