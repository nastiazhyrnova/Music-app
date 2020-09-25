import {songsList} from "./../data/songs.js";
export {insertCurrentPlaylist};

//1.PLAYLIST: CURRENT MUSIC INSERT
const insertCurrentPlaylist = _ => {
    const playListEl = document.querySelector(".song-list");

    //create a new li item function
    function addSongToPlaylist (songArrId) {
        const newLiEl = document.createElement("li");
        newLiEl.classList.add("song-table");
        newLiEl.classList.add("song-list");
        const addHtml = `<span class="song-number">${songArrId+1}</span>
                                <img src="${songsList[songArrId].cover}" alt="" class="song-cover-img">
                                <span class="song-title">
                                    <span class="song-name">${songsList[songArrId].title}</span>
                                    <span class="song-author">${songsList[songArrId].artist}</span>
                                </span>
                                <span class="song-album">Best Album Ever</span>
                                <span class="song-add-to-fav"><i class="far fa-heart"></i></span>
                                <span class="song-length">${songsList[songArrId].time}</span>
                                <span class="song-dropdown-menu-button"><i class="fas fa-ellipsis-h three-dots-icon"></i></span>`;
        // console.log(newSongLine);
        newLiEl.innerHTML = addHtml;
        playListEl.appendChild(newLiEl);
    };

    //add all songs from the file
    let length = songsList.length;
    for (let i = 0; i < length; i++) {
        addSongToPlaylist(i);
    }

}
