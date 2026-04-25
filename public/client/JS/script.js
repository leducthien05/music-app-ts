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
if (likeBtn) {
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

// Favorite button
const favoriteBtn = document.querySelectorAll("[data-song-id-favorite]");
if (favoriteBtn.length > 0) {
    favoriteBtn.forEach(btn => {
        btn.addEventListener("click", async () => {
            const songId = btn.getAttribute("data-song-id-favorite");
            const isFavorite = btn.classList.contains("favorite");
            const action = isFavorite ? "no" : "yes";
            try {
                const link = `/songs/favorite/${action}/${songId}`;
                fetch(link, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        btn.classList.toggle("favorite");
                    });
            } catch (error) {
                console.error("Error favoriting song:", error);
            }
        });
    });

}
