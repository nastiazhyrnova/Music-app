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
    // const trackBarEl = document.querySelector(".player-tracker-outer");
    const trackBarFillEl = document.querySelector(".player-tracker-inner");
    const playerTimePast = document.querySelector(".player-timepast");
    const playerTimeTotal = document.querySelector(".player-timetotal");
    const playlistTotalDuration = document.querySelector(".playlist-total-duration");
    const volumeBarInner = document.querySelector(".player-volume-tracker-inner");
    const volumeBarOuter = document.querySelector(".player-volume-tracker-outer");
    const volumeIcon = document.querySelector(".volume-icon");



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
    const getSongID = index => {
        for (let j = 1; j < liItems.length; j++) {
            let liChildren = liItems[j].children;
            if (index === Number(liChildren[1].innerHTML)) {
                songID = Number(liChildren[0].innerHTML);
            }
        }
    }
    //get song Object by song ID
    const getSongObject = id => {
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
        //insert active song info into the player bar
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
    const importAllSongs = playlist => {
        //add all songs from the file + highligth the active song
        for (let i = 0; i < playlist.length; i++) {
            //create a new li item function
            ( _ => {
                const newLiEl = document.createElement("li");
                newLiEl.classList.add("song-table");
                newLiEl.classList.add("song-single");
                const addHtml = `<span class="song-id">${playlist[i].id}</span>
                                    <span class="song-number">${i+1}</span>
                                        <img src="${playlist[i].cover}" alt="" class="song-cover-img">
                                        <span class="song-title">
                                            <span class="song-name">${playlist[i].title}</span>
                                            <span class="song-author">${playlist[i].artist}</span>
                                        </span>
                                        <span class="song-album">Best Album Ever</span>
                                        <span class="song-add-to-fav"><i class="far fa-heart"></i></span>
                                        <span class="song-length">${playlist[i].time}</span>
                                        <span class="song-dropdown-menu-button"><i class="fas fa-ellipsis-h three-dots-icon"></i></span>`;
                newLiEl.innerHTML = addHtml;
                playListEl.appendChild(newLiEl);
            })();
        songID = playlist[0].id;
        }
    };
    //--2.)Count total playlist duration and insert into the element
    //---2.1) Count total
    const countTotalDuration = playlist => {
        let totalHours = 0;
        let totalMinutes = 0;
        let totalSeconds = 0;

        //extract minutes and seconds from string
        for (let song of playlist) {
            totalMinutes += Number(song.time.slice(0, 2));
            totalSeconds += Number(song.time.slice(3));
        }

        //convert secs to minutes and mins to hours
        totalMinutes += Math.floor(totalSeconds / 60);
        totalHours += Math.floor(totalMinutes / 60);
        totalMinutes = totalMinutes - (totalHours * 60);

        return `${totalHours} hrs ${totalMinutes} min`
    }
    //---2.2) Insert total
    const insertTotalDuration = playlist => {
        playlistTotalDuration.innerHTML = countTotalDuration(playlist);
    }


    //--3.) Set queue of playing one by one by default
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
        trackBarFillEl.style.width = `${trackBarState.fillWidth}%`;
    }
    // ---3.4) Convert seconds in audio currenttime to time format
    const secToTime = secInput => {
        //round to full seconds
        let seconds = Math.floor(secInput);
        let minutes = 0;
        //set minutes if exist
        if (seconds >= 60) {
            minutes = Math.floor(seconds / 60);
            seconds = seconds % 60;
        }
        //add additional 0 if seconds are < 10
        if (seconds < 10) {
            return `${minutes}:0${seconds}`;
        }
        else {
            return `${minutes}:${seconds}`;
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


    //--4.) VOLUME BAR
    //---4.1) Change volume depending of % value
    const changeVolume = _ => {
        volumeBarOuter.addEventListener('click', e => {
            //find out by coordinates where click was made
            const clickedX = e.clientX;
            let targetElement;
            //check if we clicked on outer or on inner bar
            if (e.target.classList.contains("player-volume-tracker-inner")) {
                targetElement = e.target.parentElement.getBoundingClientRect();
            }
            else {
                targetElement = e.target.getBoundingClientRect();
            }
            // calculations of relation
            const totalWidth = targetElement.right - targetElement.left;
            const clickedPoint = clickedX - targetElement.left;
            const clickedVolume = clickedPoint / totalWidth;
            //set volume
            currentSong.volume = clickedVolume;
            //set volume bar width
            volumeBarInner.style.width = `${clickedVolume * 100}%`;
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
        insertTotalDuration(songs);
        // setDefaultQueue();
        highlightActiveSongElement();
        getClickedSongIndex();
        disablePreviousOrNext();
        updateTrackbar();
        changeVolume();
        listeners();
    }

    //IV. PUBLIC FUNCTION
    return {
        runAll: runAll
    }
})()
