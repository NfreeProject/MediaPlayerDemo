const wrapper = document.querySelector(".container"),
    musicImg = wrapper.querySelector(".img-area img"),
    musicName = wrapper.querySelector(".song-details .name"),
    musicArtist = wrapper.querySelector(".song-details .artist"),
    playPauseBtn = wrapper.querySelector(".play-pause"),
    prevBtn = wrapper.querySelector("#prev"),
    nextBtn = wrapper.querySelector("#next"),
    mainAudio = wrapper.querySelector("#main-audio"),
    progressArea = wrapper.querySelector(".progress-area"),
    progressBar = progressArea.querySelector(".progress-bar"),
    contentAllSong = wrapper.querySelector('.content__allSong'),
    musicList = wrapper.querySelector(".music-list"),
    contentPopular = wrapper.querySelector('.content__popular-list'),
    content = wrapper.querySelector('.content'),
    sidebarListContent = wrapper.querySelector('.sidebar__list-content'),
    sidebarItemContent = wrapper.querySelectorAll('.sidebar__item-content'),
    playlistDetail = wrapper.querySelector('.playlist__detail'),
    playlistDetailHeaderBack = wrapper.querySelector('.playlist__detail-header-back'),
    playlistDetailList = wrapper.querySelector('.playlist__detail-content-main-list');
let sidebarContent = [musicList,contentAllSong]

let ALLMUSIC = [];
let TYPE_PLAYLIST = [];
let ALLPLAYLIST = [];

let musicIndex = Math.floor((Math.random() * ALLMUSIC.length) + 1);
window.addEventListener('load', function() {
    fetch('./assets/js/database.json')
    .then(function(response) {
        return response.json();
    }).then((data)=> {
        ALLMUSIC = data.ALLMUSIC;
        ALLPLAYLIST = data.PLAYLIST;
        TYPE_PLAYLIST = data.TYPE_PLAYLIST;

        fillTopSong();
        loadMusic(musicIndex);
        playingSong();
    }).catch((err)=> {
        console.error(err)
    })
});
function fillTopSong() {
    for (let i = 0; i < ALLMUSIC.length; i++) {
        let liTag = `
                <li id="${'li_' + ALLMUSIC[i].id}" class="content__popular-item">
                    <h3 class="content__popular-item-top">${i + 1}</h3>
                    <div onClick="clickedThumbnailToPlay(${i + 1})" class="content__popular-item-thumbnail">
                        <img src="${ALLMUSIC[i].img}" alt="" class="">
                        <i class="material-icons">play_arrow</i>
                        <div class="list__wave">
                            <div class="wave"></div>
                            <div class="wave"></div>
                            <div class="wave"></div>
                            <div class="wave"></div>
                            <div class="wave"></div>
                        </div>
                    </div>
                    <div class="content__popular-item-inf">
                        <h3 class="content__popular-item-name">${ALLMUSIC[i].name}</h3>
                        <div class="content__popular-item-artist">${ALLMUSIC[i].artist}</div>
                    </div>
                    <div class="content__popular-item-line"></div>
                    <div class="content__popular-item-visualizations">
                        <canvas width="350px" height="40px"></canvas>
                    </div>
                    <audio class="song_${ALLMUSIC[i].id}" src="${ALLMUSIC[i].src}"></audio>
                    <div id="song_${ALLMUSIC[i].id}" class="content__popular-item-time">00:00</div>
                </li>`;
        contentPopular.insertAdjacentHTML("beforeend", liTag);
        let liAudioDuartionTag = contentPopular.querySelector(`#song_${ALLMUSIC[i].id}`);
        let liAudioTag = contentPopular.querySelector(`.song_${ALLMUSIC[i].id}`);
        liAudioTag.addEventListener("loadeddata", () => {
            let duration = liAudioTag.duration;
            let totalMin = Math.floor(duration / 60);
            let totalSec = Math.floor(duration % 60);
            if (totalSec < 10) {
                totalSec = `0${totalSec}`;
            };
            liAudioDuartionTag.innerText = `${totalMin}:${totalSec}`;
            liAudioDuartionTag.setAttribute("t-duration", `${totalMin}:${totalSec}`);
        });
    }
}

function loadMusic(indexNumb) {
    musicName.innerText = ALLMUSIC[indexNumb - 1].name;
    musicArtist.innerText = ALLMUSIC[indexNumb - 1].artist;
    musicImg.src = `${ALLMUSIC[indexNumb - 1].img}`;
    mainAudio.src = `${ALLMUSIC[indexNumb - 1].src}`;
    mainAudio.load();
}
function playMusic() {
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}
function pauseMusic() {
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}
function prevMusic() {
    musicIndex--;
    musicIndex < 1 ? musicIndex = ALLMUSIC.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}
function nextMusic() {
    musicIndex++;
    musicIndex > ALLMUSIC.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}
playPauseBtn.addEventListener("click", () => {
    const isMusicPlay = wrapper.classList.contains("paused");
    isMusicPlay ? pauseMusic() : playMusic();
    playingSong();
});
prevBtn.addEventListener("click", () => {
    prevMusic();
});
nextBtn.addEventListener("click", () => {
    nextMusic();
});
mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;
    let musicCurrentTime = wrapper.querySelector(".current-time"),
        musicDuartion = wrapper.querySelector(".max-duration");
    mainAudio.addEventListener("loadeddata", () => {
        let mainAdDuration = mainAudio.duration;
        let totalMin = Math.floor(mainAdDuration / 60);
        let totalSec = Math.floor(mainAdDuration % 60);
        if (totalSec < 10) {
            totalSec = `0${totalSec}`;
        }
        musicDuartion.innerText = `${totalMin}:${totalSec}`;
    });
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if (currentSec < 10) {
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

progressArea.addEventListener("click", (e) => {
    let progressWidth = progressArea.clientWidth;
    let clickedOffsetX = e.offsetX;
    let songDuration = mainAudio.duration;

    mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
    playMusic();
    playingSong();
});
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
    let getText = repeatBtn.innerText;
    switch (getText) {
        case "repeat":
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "Song looped");
            break;
        case "repeat_one":
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Playback shuffled");
            break;
        case "shuffle":
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "Playlist looped");
            break;
    }
});
mainAudio.addEventListener("ended", () => {
    let getText = repeatBtn.innerText;
    switch (getText) {
        case "repeat":
            nextMusic();
            break;
        case "repeat_one":
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();
            break;
        case "shuffle":
            let randIndex = Math.floor((Math.random() * ALLMUSIC.length) + 1);
            do {
                randIndex = Math.floor((Math.random() * ALLMUSIC.length) + 1);
            } while (musicIndex == randIndex);
            musicIndex = randIndex;
            loadMusic(musicIndex);
            playMusic();
            playingSong();
            break;
    }
});
function playingSong() {
    const liUnactive = contentPopular.querySelector('.active');
    if (liUnactive != null) {
        liUnactive.querySelector('.material-icons').textContent = 'play_arrow'
        liUnactive.querySelector('.list__wave').style.opacity = 0;
        liUnactive.classList.remove('active');
    }
    const liActive = contentPopular.querySelector(`#${'li_' + ALLMUSIC[musicIndex - 1].id}`)
    liActive.classList.add('active')
    if (!mainAudio.paused) {
        liActive.querySelector('.material-icons').textContent = '';
        liActive.querySelector('.list__wave').style.opacity = 1;

    }
}
function clicked(element) {
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}

function clickedThumbnailToPlay(index) {
    if (index !== musicIndex) {
        musicIndex = index;
        loadMusic(musicIndex);
        playMusic();
    } else {
        mainAudio.paused ? playMusic() : pauseMusic();
    }
    playingSong();
}

for (let i = 0; i < sidebarItemContent.length; i++) {
    sidebarItemContent[i].addEventListener('click', function () {
        sidebarListContent.querySelector('.active').classList.remove('active');
        hideContent();
        sidebarItemContent[i].classList.add('active');
        switch (i) {
            case 0:
                showPlaylist();
                break;
            case 1:
                showSongs();
                break;
        }
    })
}
function showPlaylist() {
    musicList.classList.add('activeItem');
}
function showSongs() {
    contentAllSong.classList.add('activeItem');
}
function hideContent() {
    sidebarContent.forEach(e => {
        if (e.classList.contains('activeItem')) {
            e.classList.remove('activeItem');
        }
    });
}