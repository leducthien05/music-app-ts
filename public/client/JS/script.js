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