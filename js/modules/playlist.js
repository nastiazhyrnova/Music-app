import {songsList as songs, songsList} from "./../data/songs.js";

export const PlaylistMainFunction =  ( _ => {
    //I. DECLARATIONS & caching the DOM

    const playListEl = document.querySelector(".song-list");
    const mainPlayButton = document.querySelector(".play-button");
    const playerPlayButton = document.querySelector(".player-playpause-button");
    const playIcons = document.querySelectorAll(".fa-play");
    const nextButton = document.querySelector(".player-next-button");
    const prevButton = document.querySelector(".player-previous-button");
    const activeSongCover = document.querySelector(".active-song-cover");
    const activeSongTitle = document.querySelector(".player-active-song-name");
    const activeSongArtist = document.querySelector(".player-active-song-artist");
    const trackBarEl = document.querySelector(".player-tracker-outer");
    const trackBarFillEl = document.querySelector(".player-tracker-inner");
    const playerTimePast = document.querySelector(".player-timepast");
    const playerTimeTotal = document.querySelector(".player-timetotal");


    let currentPlayingIndex = 1;
    let clickedIndex = 1;
    let songID;
    let currentSong = new Audio(songs[currentPlayingIndex-1].url);
    let playQueue = []; //start with index [0]
    let liItems = playListEl.children; // li items start with [1] as [0] is header & = display order

    const trackBarState = {
        currentTrackTime: 0,
        fullTrackTime: 0,
        fullWidth: 0
    }

    //II. AUXULIARY FUNCTIONS (OR REPEATED)

    //get songID by index
    const getSongID = (index) => {
        for (let j = 1; j < liItems.length; j++) {
            let liChildren = liItems[j].children;
            if (index === Number(liChildren[1].innerHTML)) {
                songID = Number(liChildren[0].innerHTML);
            }
        }
    }
    //get song Object by song ID
    const getSongObject = (id) => {
        for (let eachSong of songs) {
            if (eachSong.id == id) {
                return eachSong;
            }
        }
    }
    //visual changes for an active song - highlighting etc by song ID
    const highlightActiveSongElement = _ => {
        //highlight line and titles in the playlist
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
        //inserto into the player bar
        const activeSongObject = getSongObject(songID);
        activeSongCover.src = activeSongObject.cover;
        activeSongTitle.innerHTML = activeSongObject.title;
        activeSongArtist.innerHTML = activeSongObject.artist;
        playerTimeTotal.innerHTML = activeSongObject.time;



    }
    //function to start playing current song
    const playCurrentSong = _ => {
        currentSong.play();
        for (let icon of playIcons) {
            icon.classList.remove("fa-play");
            icon.classList.add("fa-pause");
        }
    }
    //function to toggle play/pause (mainly for buttons)
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
    //change audio source of the current song to the assigned songID
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
        songID = playlistName[0].id;
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
                clickedIndex = Number(liChildren[1].innerHTML);
                songID = Number(liChildren[0].innerHTML);
                playPauseIfClicked();
            })
        }
    }
    //---1.2) Play/pause if clicked, or change song and play
    const playPauseIfClicked = _ => {
        if (currentPlayingIndex === clickedIndex) {
            togglePlayPause();
        }
        else {
            currentPlayingIndex = clickedIndex;
            changeURLofSong();
            togglePlayPause();
        }
        highlightActiveSongElement();
    }


    //--2.) NEXT/PREVIOUS BUTTONS

    //---2.1) Next or previous song: pass paramether 1 to play next song, or pass 0 to play previous
    const nextOrPrevSong = (boolean) => {
        boolean === 1 ? currentPlayingIndex++ : currentPlayingIndex--;
        getSongID(currentPlayingIndex);
        changeURLofSong();
        playCurrentSong();
    }
    //---2.2) disable previous/next button if no song after or before is not available
    const disablePreviousOrNext = _ => {
        if (currentPlayingIndex === songs.length) {
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


    //--3.) TRACKBAR

    //---3.1) calculate current width % of the trackbar
    const getTrackBarPercent = (current, full) => {
        return (current / full * 100);
    }
    //---3.2) set state of the trackbar
    const setTrackBarState = obj => {
        trackBarState.currentTrackTime = obj.currentTime;
        trackBarState.fullTrackTime = obj.duration;
        trackBarState.fillWidth = getTrackBarPercent(trackBarState.currentTrackTime, trackBarState.fullTrackTime);
        changeTrackBarFill()
    }
    //---3.3) Change trackbar fill
    const changeTrackBarFill = _ => {
        trackBarFillEl.style.width = `${trackBarState.fillWidth}%`
    }
    // ---3.4) Convert seconds if audio currenttime to time format
    const secToTime = seconds => {
        //round to full seconds
        let roundedSec = Math.floor(seconds);
        let minutes = 0;
        //set minutes
        if (roundedSec >= 60) {
            minutes = roundedSec % 60;
            roundedSec = roundedSec - (minutes * 60);
        }

        //add additional 0 is seconds are < 10
        if (roundedSec < 10) {
            return `${minutes}:0${roundedSec}`;
        }
        else {
            return `${minutes}:${roundedSec}`;
        }
      }
    //---3.5) Update trackbar while playing
    const changeTimePast = _ => {
        playerTimePast.innerHTML = secToTime(trackBarState.currentTrackTime);
    }
    //---3.6) Update trackbar and time while playing
    const updateTrackbar = _ => {
        currentSong.addEventListener('timeupdate', _ => {
            setTrackBarState(currentSong);
            changeTrackBarFill();
            changeTimePast();
        })
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
        // setDefaultQueue();
        highlightActiveSongElement();
        getClickedSongIndex();
        disablePreviousOrNext();
        updateTrackbar();
        listeners();
    }

    //IV. PUBLIC FUNCTION
    return {
        runAll: runAll
    }
})()
