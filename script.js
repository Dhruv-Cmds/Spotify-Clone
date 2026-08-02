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

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

// local
// const songsBaseURL = "http://127.0.0.1:3000/songs/";

// vps
const songsBaseURL = "/songs/";
const playlistSongs = {};

// Fetch music from one playlist folder.
async function getSongs(playlist) {

    let a = await fetch(`${songsBaseURL}${playlist}/`);
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

function getSongName(song) {
    return decodeURIComponent(new URL(song).pathname.split("/").pop());
}

const currentSong = new Audio;

/* Variable whose value is function initialy this function waiting for track which will come after 
main function execute then this function will execute and play song */

const playMusic = (track, pause = false) => {

    // local
    // const songURL = track.startsWith("http")
    //     ? track
    //     : `http://127.0.0.1:3000/songs/${encodeURIComponent(track)}`;

    // vps
    const songURL = track.startsWith("http")
        ? track
        : `/songs/${encodeURIComponent(track)}`;


    const songName = decodeURIComponent(
        new URL(songURL).pathname.split("/").pop()
    );

    currentSong.src = songURL;

    if (!pause) {
        currentSong.play();
        play.src = "svgs/pause.svg";
    } else {
        play.src = "svgs/play.svg";
    };

    document.querySelector(".song-info").innerHTML = songName;
    document.querySelector(".song-time").innerHTML = "00:00 / 00:00";
}

async function main() {

    let songs = [];
    let currentSongIndex = 0;

    let songUL = document.querySelector(".songs-list").getElementsByTagName("ul")[0];

    async function selectPlaylist(playlist) {
        if (!playlistSongs[playlist]) {
            playlistSongs[playlist] = await getSongs(playlist);
        }

        songs = playlistSongs[playlist];
        currentSongIndex = 0;
        songUL.innerHTML = "";

        for (const song of songs) {
            songUL.innerHTML += `<li><img width="34" src="svgs/music.svg" alt="">
                                <div class="info">
                                    <div>${getSongName(song)}</div>
                                    <div>Credit goes to respective owners</div>
                                </div>
                                <div class="playnow">
                                    <span>Play Now</span>
                                    <img class="invert" src="svgs/play.svg" alt="">
                                </div></li>`;
        }

        Array.from(songUL.getElementsByTagName("li")).forEach((songItem, index) => {
            songItem.addEventListener("click", () => {
                currentSongIndex = index;
                playMusic(songs[currentSongIndex]);
            });
        });

        if (songs.length) {
            playMusic(songs[0], true);
        }

        songsTab.click();
    }

    document.querySelectorAll(".card[data-playlist]").forEach(card => {
        card.addEventListener("click", () => {
            selectPlaylist(card.dataset.playlist);
        });
    });

    await selectPlaylist("english");

    // Attack an event listenr to paly

    play.addEventListener("click", () => {

        if (currentSong.paused) {
            currentSong.play();
            play.src = "svgs/pause.svg"
        }

        else {
            currentSong.pause();
            play.src = "svgs/play.svg"
        }

    });

    // Add an event listener to previous
    previous.addEventListener("click", () => {
        if (currentSongIndex > 0) {
            currentSongIndex -= 1;
            playMusic(songs[currentSongIndex]);
        }
    });

    // Add an event listener to next
    next.addEventListener("click", () => {
        if (currentSongIndex < songs.length - 1) {
            currentSongIndex += 1;
            playMusic(songs[currentSongIndex]);
        }
    });

    currentSong.addEventListener("ended", () => {
        if (currentSongIndex < songs.length - 1) {
            currentSongIndex += 1;
            playMusic(songs[currentSongIndex]);
        } else {
            play.src = "svgs/play.svg";
        }
    });

    // Listen for timeupdate event

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".song-time").innerHTML = `
        ${secondsToMinutesSeconds(currentSong.currentTime)}/
        ${secondsToMinutesSeconds(currentSong.duration)}`
        if (currentSong.duration) {
            document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
        }
    });

    //  Add an event listner to seekbar

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    });

    // Add an event listner for hamburger

    let isLeftPanelOpen = false;
    const hamburger = document.querySelector(".hamburger");
    const hamburgerIcon = hamburger.querySelector("img");
    const leftPanel = document.querySelector(".left");

    hamburger.addEventListener("click", () => {
        isLeftPanelOpen = !isLeftPanelOpen;
        leftPanel.style.left = isLeftPanelOpen ? "0" : "-120%";
        hamburgerIcon.src = isLeftPanelOpen
            ? "svgs/hamburger-open.svg"
            : "svgs/hamburger-close.svg";
    });
};

main();
