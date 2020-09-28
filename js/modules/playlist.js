import {songsList as songs, songsList} from "./../data/songs.js";

export const PlaylistMainFunction =  ( _ => {
    //---DECLARATIONS & DOM

    let currentPlayingIndex = 1;
    let currentSong = new Audio(songs[currentPlayingIndex].url);
    let isPlaying = false;

    const playListEl = document.querySelector(".song-list");
    const mainPlayButton = document.querySelector(".play-button");
    const playIcons = document.querySelectorAll(".fa-play")
    const playerPlayButton = document.querySelector(".player-playpause-button");


    //---AUXULIARY FUNCTIONS (OR REPEATED MORE THAN ONCE)

    //visual changes for an active song - highlighting etc
    const highlightActiveSongElement = (songIndex, styleForActive) => {
        if (songIndex === currentPlayingIndex) {
            return styleForActive;
        }
    }

    // //function to toggle play/pause icon when a song is playing
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
        currentSong.src = songs[currentPlayingIndex].url;
    }


    //---MAIN FUNCTIONS

    //1. Insert music from the playlist
    const importAllSongs = _ => {
        //add all songs from the file + highligth the active song
        let length = songs.length;
        for (let i = 1; i <= length; i++) {
            //create a new li item function
            ( _ => {
                const newLiEl = document.createElement("li");
                newLiEl.classList.add("song-table");
                newLiEl.classList.add("song-single");
                const addHtml = `<span class="song-number ${highlightActiveSongElement(i, 'song-active')}">${i}</span>
                                        <img src="${songs[i-1].cover}" alt="" class="song-cover-img">
                                        <span class="song-title">
                                            <span class="song-name ${highlightActiveSongElement(i, 'song-active')}">${songs[i-1].title}</span>
                                            <span class="song-author">${songs[i-1].artist}</span>
                                        </span>
                                        <span class="song-album">Best Album Ever</span>
                                        <span class="song-add-to-fav"><i class="far fa-heart"></i></span>
                                        <span class="song-length">${songs[i-1].time}</span>
                                        <span class="song-dropdown-menu-button"><i class="fas fa-ellipsis-h three-dots-icon"></i></span>`;
                // console.log(newSongLine);
                newLiEl.innerHTML = addHtml;
                playListEl.appendChild(newLiEl);
            })();
        }
    };


    //2. Change current playing index to the index of the clicked song
    const getClickedSongIndex = (e) => {
        for (let eachChild of playListEl.children) {
            eachChild.addEventListener('click', e => {
                const clickedIndexOfLi = [...eachChild.parentElement.children].indexOf(eachChild);
                mainPlay(clickedIndexOfLi);
            })
        }
    }

    //3. Main play function
    const mainPlay = clickedIndex => {
        if (currentPlayingIndex === clickedIndex) {
            togglePlayPause();
        }
        else {
            currentPlayingIndex = clickedIndex;
            changeURLofSong();
            togglePlayPause();
        }
    }

    //???. Run all event listeners
    const listeners = _ => {
        mainPlayButton.addEventListener('click', (e) => {
            e.preventDefault();
            togglePlayPause();
        });
        playerPlayButton.addEventListener('click', (e) => {
            e.preventDefault();
            togglePlayPause();
        });
    }



    //---RUN ALL MAIN FUNCTIONS TOGETHER
    const runAll = _ => {
        importAllSongs();
        getClickedSongIndex();
        listeners();
    }

    //---PUBLIC FUNCTION
    return {
        runAll: runAll
    }
})()
