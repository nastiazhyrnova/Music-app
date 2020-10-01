import {songsList as songs, songsList} from "./data/songs.js";
import * as Responsive from "./modules/responsive.js"
import {PlaylistMainFunction} from "./modules/playlist.js"

const App = ( _ => {

    //main private function to run everything inside of the app
    const runAllFuncs = _ => {
        Responsive.burgerMenu();
        PlaylistMainFunction.runAll();
    }

    //make main function public
    return {
        runAll: runAllFuncs
    }

})();

App.runAll();


//MINIMUM VIABLE PRODUCT CREATED
//FUNCTIONALITIES TO ADD IN THE FUTURE (SCALABLE)

//1. Shuffle option (button is hidden)
//2. Song loop (button is hidden)
//3. Load another playlist from the list on the sidebar
//4. Favorites  (buttons are hidden)
//5. Current song trackbar click event and change time of the song