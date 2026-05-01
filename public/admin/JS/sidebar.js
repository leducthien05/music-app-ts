const sidebar = document.querySelectorAll(".menu-item");
if(sidebar.length > 0){
    const path = window.location.pathname;
    sidebar.forEach(item =>{
        const href = item.getAttribute("href");
        if(path.startsWith(href)){
            item.classList.add("active");
        }
    });
}