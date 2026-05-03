const sidebar = document.querySelectorAll(".nav-item");

if (sidebar.length > 0) {
    const path = window.location.pathname;
    const permissionItem = document.querySelector(".favorite");
    sidebar.forEach(item => {
        const href = item.querySelector("a").getAttribute("href");
        // reset trước
        item.classList.remove("active");

        // ưu tiên route permission
        if (permissionItem) {
            const permissionHref = permissionItem.querySelector("a").getAttribute("href");

            if (path.startsWith(permissionHref)) {
                permissionItem.classList.add("active");
                return; // skip các menu khác
            }
        }

        // match chính xác hoặc theo prefix
        if (path === href || (href !== "/" && path.startsWith(href))) {
            item.classList.add("active");
        }
    });
}