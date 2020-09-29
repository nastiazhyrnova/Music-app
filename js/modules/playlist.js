import {songsList as songs, songsList} from "./../data/songs.js";

export const PlaylistMainFunction =  ( _ => {
    //I. DECLARATIONS & caching the DOM

    const playListEl = document.querySelector(".song-list");
    const mainPlayButton = document.querySelector(".play-button");
    const playerPlayButton = document.querySelector(".player-playpause-button");
    const playIcons = document.querySelectorAll(".fa-play");
    const nextButton = document.querySelector(".player-next-button");
    const prevButton = document.querySelector(".player-previous-button");


    let currentPlayingIndex = 1;
    let nextIndex = 1;
    let songID = 25;
    let currentSong = new Audio(songs[currentPlayingIndex-1].url);
    let playQueue = []; //start with index [0]
    let liItems = playListEl.children; // li items start with [1] as [0] is header & = display order

    //II. AUXULIARY FUNCTIONS (OR REPEATED)

    //visual changes for an active song - highlighting etc
    const highlightActiveSongElement = _ => {
        for (let j = 1; j < liItems.length; j++) {
            const children = liItems[j].children;
            if (liItems[j].firstElementChild.innerHTML == songID) {
                liItems[j].classList.add("song-active-row");
                children[1].classList.add("song-active");
                children[3].firstElementChild.classList.add("song-active");
            }
            else {
                liItems[j].classList.remove("song-active-row");
                children[1].classList.remove("song-active");
                children[3].firstElementChild.classList.remove("song-active");
            }
        }
    }
    //function to toggle play/pause
    const togglePlayPause = _ => {
        if (currentSong.paused) {
            currentSong.play();
            for (let icon of playIcons) {
                icon.classList.remove("fa-play");
                icon.classList.add("fa-pause");
            }
        }
        else {
            currentSong.pause();
            for (let icon of playIcons) {
                icon.classList.remove("fa-pause");
                icon.classList.add("fa-play");
            }
        }
    }
    //change audio source of the current song
    const changeURLofSong = _ => {
        for (let i = 0; i < songs.length; i++) {
            if (songs[i].id == songID) {
                currentSong.src = songs[i].url;
            }
        }
    }



    //III. MAIN FUNCTIONS



    //-1. LOAD INFO INTO THE PAGE

    //--1). Insert music from the playlist
    const importAllSongs = (playlistName) => {
        //add all songs from the file + highligth the active song
        for (let i = 0; i < playlistName.length; i++) {
            //create a new li item function
            ( _ => {
                const newLiEl = document.createElement("li");
                newLiEl.classList.add("song-table");
                newLiEl.classList.add("song-single");
                const addHtml = `<span class="song-id">${playlistName[i].id}</span>
                                    <span class="song-number">${i+1}</span>
                                        <img src="${playlistName[i].cover}" alt="" class="song-cover-img">
                                        <span class="song-title">
                                            <span class="song-name">${playlistName[i].title}</span>
                                            <span class="song-author">${playlistName[i].artist}</span>
                                        </span>
                                        <span class="song-album">Best Album Ever</span>
                                        <span class="song-add-to-fav"><i class="far fa-heart"></i></span>
                                        <span class="song-length">${playlistName[i].time}</span>
                                        <span class="song-dropdown-menu-button"><i class="fas fa-ellipsis-h three-dots-icon"></i></span>`;
                newLiEl.innerHTML = addHtml;
                playListEl.appendChild(newLiEl);
            })();
        }
    };
    //--2). Set queue of playing one by one by default
    const setDefaultQueue = _ => {
        for (let song of songs) {
            playQueue.push(song);
        }
    }




    //-2. PLAYING FUNCTIONALITIES

    //--1.) CLICKING ON THE SONG
    //---1.1) Change current playing index to the index of the clicked song & get new song ID
    const getClickedSongIndex = _ => {
        for (let j = 1; j < liItems.length; j++) {
            liItems[j].addEventListener('click', e => {
                let liChildren = liItems[j].children;
                nextIndex = Number(liChildren[1].innerHTML);
                songID = Number(liChildren[0].innerHTML);
                playPauseIfClicked();
            })
        }
    }
    //---1.2) Play/pause if clicked, or change song and play
    const playPauseIfClicked = _ => {
        if (currentPlayingIndex === nextIndex) {
            togglePlayPause();
        }
        else {
            currentPlayingIndex = nextIndex;
            changeURLofSong();
            togglePlayPause();
        }
    }

    //--2.) NEXT/PREVIOUS BUTTONS
    //---2.1) Next or previous song: pass paramether 1 to play next song, or pass 0 to play previous
    const nextOrPrevSong = (boolean) => {
        boolean === 1 ? currentPlayingIndex++ : currentPlayingIndex--;
        nextIndex = currentPlayingIndex;
        getSongID();
        changeURLofSong();
        currentSong.play();
        for (let icon of playIcons) {
            icon.classList.remove("fa-play");
            icon.classList.add("fa-pause");
        }
    }
    //---2.2) get songID of the next song (next index)
    const getSongID = _ => {
        for (let j = 1; j < liItems.length; j++) {
            let liChildren = liItems[j].children;
            if (nextIndex === Number(liChildren[1].innerHTML)) {
                songID = Number(liChildren[0].innerHTML);
            }
        }
    }
    //---2.3) disable previous/next button if no song after or before is available
    const disablePreviousOrNext = _ => {
        if (currentPlayingIndex == liItems.length) {
            nextButton.disabled = true;
        }
        else if (currentPlayingIndex == 1) {
            prevButton.disabled = true;
        }
        else {
            nextButton.disabled = false;
            prevButton.disabled = false;
        }
    }


    //-3. EVENT LISTENERS ON THE BUTTONS AND PLAYLIST
    //-- Run all event listeners
    const listeners = _ => {
        mainPlayButton.addEventListener('click', e => {
            e.preventDefault();
            togglePlayPause()
        });
        playerPlayButton.addEventListener('click', e => {
            e.preventDefault();
            togglePlayPause();
        });
        currentSong.addEventListener('ended', e => {
            nextOrPrevSong(1);
            highlightActiveSongElement();
            disablePreviousOrNext();
        })
        nextButton.addEventListener('click', e => {
            e.preventDefault();
            nextOrPrevSong(1);
            highlightActiveSongElement();
            disablePreviousOrNext();
        })
        prevButton.addEventListener('click', e => {
            e.preventDefault();
            nextOrPrevSong(0);
            highlightActiveSongElement();
            disablePreviousOrNext();
        })
    }


    //-4. RUN ALL MAIN FUNCTIONS TOGETHER
    const runAll = _ => {
        importAllSongs(songs);
        setDefaultQueue();
        highlightActiveSongElement();
        getClickedSongIndex();
        listeners();
        disablePreviousOrNext();
    }

    //IV. PUBLIC FUNCTION
    return {
        runAll: runAll
    }
})()
