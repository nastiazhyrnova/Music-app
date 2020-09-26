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