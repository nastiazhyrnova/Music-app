import {songsList as songs} from "./../data/songs.js";

export const PlaylistMainFunction =  ( _ => {
    //---DECLARATIONS & DOM

    let currentPlayingIndex = 0;
    let currentSong = new Audio(songs[currentPlayingIndex].url);
    let isPlaying = false;

    const playListEl = document.querySelector(".song-list");
    const mainPlayButton = document.querySelector(".play-button");
    const playIcons = document.querySelectorAll(".fa-play")
    const playerPlayButton = document.querySelector(".player-playpause-button");


    //---AUXULIARY FUNCTIONS

    //visual changes for an active song - highlighting etc
    const highlightActiveSongElement = (songIndex, styleForActive) => {
        if (songIndex === currentPlayingIndex) {
            return styleForActive;
        }
    }

    // //function to toggle play/pause icon when song is playing
    const playPause = (button) => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
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
        })
    }



    //---MAIN FUNCTIONS

    //1. Insert music from the playlist
    const importAllSongs = _ => {
        //add all songs from the file + highligth the active song
        let length = songs.length;
        for (let i = 0; i < length; i++) {
            //create a new li item function
            ( _ => {
                const newLiEl = document.createElement("li");
                newLiEl.classList.add("song-table");
                newLiEl.classList.add("song-single");
                const addHtml = `<span class="song-number ${highlightActiveSongElement(i, 'song-active')}">${i+1}</span>
                                        <img src="${songs[i].cover}" alt="" class="song-cover-img">
                                        <span class="song-title">
                                            <span class="song-name ${highlightActiveSongElement(i, 'song-active')}">${songs[i].title}</span>
                                            <span class="song-author">${songs[i].artist}</span>
                                        </span>
                                        <span class="song-album">Best Album Ever</span>
                                        <span class="song-add-to-fav"><i class="far fa-heart"></i></span>
                                        <span class="song-length">${songs[i].time}</span>
                                        <span class="song-dropdown-menu-button"><i class="fas fa-ellipsis-h three-dots-icon"></i></span>`;
                // console.log(newSongLine);
                newLiEl.innerHTML = addHtml;
                playListEl.appendChild(newLiEl);
            })();
        }
    };


    //2. ADD EVENT LISTENERS
    const eventListeners = _ => {
        playPause(mainPlayButton);
        playPause(playerPlayButton);
    }

    //---RUN ALL MAIN FUNCTIONS TOGETHER
    const runAll = _ => {
        importAllSongs();
        eventListeners();
    }

    //---PUBLIC FUNCTION
    return {
        runAll: runAll
    }
})()
