import {songsList} from "./data/songs.js";

//PLAYLIST: MUSIC INSERT
const playListEl = document.querySelector(".song-list");


for (let i = 0; i < songsList.length; i++) {
    addSongToPlaylist(i);
}





//create a new li item
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

playListEl.scrollIntoView()
// addSongToPlaylist(2);

