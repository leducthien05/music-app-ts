const sidebar = document.querySelectorAll(".menu-item");

if (sidebar.length > 0) {
    const path = window.location.pathname;

    const permissionItem = document.querySelector(".permission-sidebar");

    sidebar.forEach(item => {
        const href = item.getAttribute("href");

        // reset trước
        item.classList.remove("active");

        // ưu tiên route permission
        if (permissionItem) {
            const permissionHref = permissionItem.getAttribute("href");

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