console.log("App is working")

//  To sawp between Your library tab and song tab at left side (left section)
const libraryTab = document.getElementById("libraryTab");
const songsTab = document.getElementById("songsTab");

const libraryContent = document.getElementById("libraryContent");
const songsContent = document.getElementById("songsContent");

libraryTab.onclick = () => {

    libraryTab.style.textDecoration = "underline"
    songsTab.style.textDecoration = "none"

    libraryContent.style.display = "block";
    songsContent.style.display = "none";
};

songsTab.onclick = () => {

    songsTab.style.textDecoration = "underline"
    libraryTab.style.textDecoration = "none"

    libraryContent.style.display = "none";
    songsContent.style.display = "block";
};

// feacting musics from folders
async function getSongs() {

    let a = await fetch("http://127.0.0.1:3000/songs/");
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");

    let songs = [];
    for (let i = 0; i < as.length; i++) {
        const element = as[i];

        if (element.href.endsWith(".mp3")) {
            songs.push(element.href);
        };
    };
    return songs;
};


async function main() {

    // Get the list of all the songs
    let songs = await getSongs();
    console.log(songs);

    let songUL = document.querySelector(".songs-list").getElementsByTagName("ul")[0]

    songUL.innerHTML = ""

    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img width="34" src="svgs/music.svg" alt="">
                            <div class="info">
                                <div> ${decodeURIComponent(song.split("/songs/")[1])}</div>
                                <div>Credit goes to respective owners</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img  style="width: 30px; height: 50px;" class="invert" src="svgs/play.svg" alt="">
                            </div> </li>`;
    }


    // play the first song
    var audio = new Audio(songs[5]);
    audio.play().catch(() => {
        console.log("Playback will start after a user interaction.");
    });

    audio.addEventListener("loadedmetadata", () => {
        let duration = audio.duration;
        console.log(duration);
    });
};

main();
