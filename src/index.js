import './styles/style.scss'
import GlitchGL from './vendor/glitchgl/index.js'



const glitchScene = new GlitchGL({
    container:'.glitch-container',
    images:'.glitch-container > img'
});

function __main__(){

    //initialise glitch scene
    glitchScene.init();

    //add listener to list
    // use setActivePicture Method to alterate glitched picture
    document.querySelectorAll('.glitch-pictures-list > li')
            .forEach( (item,index) => item.addEventListener('mouseenter', () => glitchScene.setActivePicture(index)));
    
}



window.onload = __main__;

