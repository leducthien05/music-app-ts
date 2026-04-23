// APlayer
const aplayer = document.querySelector('#aplayer');
if (aplayer) {
    const songData = JSON.parse(aplayer.getAttribute('data-song'));
    const singerData = JSON.parse(aplayer.getAttribute('data-singer'));
    const ap = new APlayer({
        container: document.getElementById('aplayer'),
        audio: [
            {
                name: songData.nameSong,
                artist: singerData.nameSinger,
                url: songData.audio,
                cover: songData.avatar
            }
        ],
        autoplay: true,
    });
}

// Like button
const likeBtn = document.querySelector("[data-song-id-like]");
if(likeBtn) {
    likeBtn.addEventListener("click", async () => {
        const songId = likeBtn.getAttribute("data-song-id-like");
        const isLiked = likeBtn.classList.contains("liked");
        const action = isLiked ? "no" : "yes";  
        try {
            const link = `/songs/like/${action}/${songId}`;
            fetch(link, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                }
            })            
                .then(res => res.json())
                .then(data => {
                    const spanCount = likeBtn.querySelector(".count-like");
                    if (spanCount) {
                        spanCount.textContent = data.likeCount.toString();
                    }
                    likeBtn.classList.toggle("liked");
                });
        } catch (error) {
            console.error("Error liking song:", error);
        }
    });
}
