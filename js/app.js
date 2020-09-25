import * as Responsive from "./modules/responsive.js"
import * as Playlist from "./modules/playlist.js"

const App = ( _ => {




    //main private function to run everything inside of the app
    const runAllFuncs = _ => {
        Responsive.burgerMenu();
        Playlist.insertCurrentPlaylist();
    }

    //make main function public
    return {
        runAll: runAllFuncs
    }

})();

App.runAll();