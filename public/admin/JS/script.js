// const today = new Date().toISOString().split("T")[0];
// document.getElementById("dateInput").setAttribute("min", today);

// Phân trang
const pageLink = document.querySelectorAll(".page-link");
if(pageLink.length > 0){
    pageLink.forEach(item =>{
        let url = new URL(window.location.href);
        item.addEventListener("click", ()=>{
            const currentPage = item.getAttribute("number-page");
            if(currentPage){
                url.searchParams.set("page", currentPage);
                window.location.href = url.href;
            }
        });
    });
}