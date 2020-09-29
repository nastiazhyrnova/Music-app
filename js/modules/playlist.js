import {songsList as songs, songsList} from "./../data/songs.js";

export const PlaylistMainFunction =  ( _ => {
    //---DECLARATIONS & caching the DOM

    const playListEl = document.querySelector(".song-list");
    const mainPlayButton = document.querySelector(".play-button");
    const playerPlayButton = document.querySelector(".player-playpause-button");
    const playIcons = document.querySelectorAll(".fa-play");
    const nextIcon = document.querySelector(".next-icon");
    const prevIcon = document.querySelector(".previous-icon");


    let currentPlayingIndex = 1;
    let clickedIndex = 1;
    let songID = 25;
    let currentSong = new Audio(songs[currentPlayingIndex-1].url);
    let isPlaying = false;
    let playQueue = []; //start with index [0]
    let liItems = playListEl.children; // li items start with [1] as [0] is header & = display order

    //---AUXULIARY FUNCTIONS (OR REPEATED MORE THAN ONCE)

    //set queue of playing one by one by default
    const setDefaultQueue = _ => {
        for (let song of songs) {
            playQueue.push(song);
        }
    }

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

    // //function to toggle play/pause
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


    //---MAIN FUNCTIONS

    //1. Insert music from the playlist
    const importAllSongs = _ => {
        //add all songs from the file + highligth the active song
        for (let i = 0; i < songs.length; i++) {
            //create a new li item function
            ( _ => {
                const newLiEl = document.createElement("li");
                newLiEl.classList.add("song-table");
                newLiEl.classList.add("song-single");
                const addHtml = `<span class="song-id">${songs[i].id}</span>
                                    <span class="song-number">${i+1}</span>
                                        <img src="${songs[i].cover}" alt="" class="song-cover-img">
                                        <span class="song-title">
                                            <span class="song-name">${songs[i].title}</span>
                                            <span class="song-author">${songs[i].artist}</span>
                                        </span>
                                        <span class="song-album">Best Album Ever</span>
                                        <span class="song-add-to-fav"><i class="far fa-heart"></i></span>
                                        <span class="song-length">${songs[i].time}</span>
                                        <span class="song-dropdown-menu-button"><i class="fas fa-ellipsis-h three-dots-icon"></i></span>`;
                newLiEl.innerHTML = addHtml;
                playListEl.appendChild(newLiEl);
            })();
        }
    };


    //2. Change current playing index to the index of the clicked song
    const getClickedSongIndex = _ => {
        for (let j = 1; j < liItems.length; j++) {
            liItems[j].addEventListener('click', e => {
                let liChildren = liItems[j].children;
                clickedIndex = Number(liChildren[1].innerHTML);
                songID = Number(liChildren[0].innerHTML);
                playPauseIfClicked();
            })
        }
    }

    //3. Play Pause of a clicked song
    const playPauseIfClicked = _ => {
        if (currentPlayingIndex === clickedIndex) {
            togglePlayPause();
        }
        else {
            currentPlayingIndex = clickedIndex;
            changeURLofSong();
            togglePlayPause();
        }
    }

    //4. get ID of the src depending on the queue order
    const getSongID = _ => {
        for (let j = 1; j < liItems.length; j++) {
            let liChildren = liItems[j].children;
            if (clickedIndex === Number(liChildren[1].innerHTML)) {
                songID = Number(liChildren[0].innerHTML);
            }
        }
    }

    //4. Next pr previous song: pass paramether 1 to play next song, or pass 0 to play previous
    const nextOrPrevSong = (boolean) => {
        boolean === 1 ? currentPlayingIndex++ : currentPlayingIndex--;
        clickedIndex = currentPlayingIndex;
        getSongID();
        changeURLofSong();
        currentSong.play();
        for (let icon of playIcons) {
            icon.classList.remove("fa-play");
            icon.classList.add("fa-pause");
        }

    }

    //???. Run all event listeners
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

        })
        nextIcon.addEventListener('click', e => {
            e.preventDefault();
            nextOrPrevSong(1);
            highlightActiveSongElement();

        })
        prevIcon.addEventListener('click', e => {
            e.preventDefault();
            nextOrPrevSong(0);
            highlightActiveSongElement();

        })
    }


    //---RUN ALL MAIN FUNCTIONS TOGETHER
    const runAll = _ => {
        importAllSongs();
        setDefaultQueue();
        highlightActiveSongElement();
        getClickedSongIndex();
        listeners();
    }

    //---PUBLIC FUNCTION
    return {
        runAll: runAll
    }
})()
