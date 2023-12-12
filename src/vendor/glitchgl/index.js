import * as THREE from 'three';
import './index.scss';
import Picture from './picture';

export default class {

    play = false;
    activePicture = 0;

    constructor({ container, images }) {
        this.container = document.querySelector(container);
        this.images = [...document.querySelectorAll(images)];
        this.meshes = [];
    }

    init() {
        if (!this.container || !this.images) { return console.warn('No container or images has been found'); }

        //inject container css 
        this.container.classList.add('glitch-gl-container');

        //setup three js scene
        this.setupScene();
        this.setupCamera();

        //generate picture meshes from img list
        this.generatePictures();
        this.setActivePicture(0); //init

        this.setupRenderer();

        //render whole scene
        this.render();
    }

    setViewPortSize() {
        const { width, height } = this.container.getBoundingClientRect();
        return { width, height };
    }

    get viewport() {
        const { width, height } = this.setViewPortSize();
        let aspectRatio = width / height;
        return {
            width,
            height,
            aspectRatio
        }
    }

    generatePictures() {
        this.images = this.images.map((img, index) => {
            const picture = new Picture({
                element: img,
                scene: this.scene,
                id: index,
                active: this.activePicture === index
            });
            picture.init();
            return picture;
        }
        );

    }

    setupScene() {
        // Create new scene
        this.scene = new THREE.Scene();
    }

    setupCamera() {
        window.addEventListener('resize', this.onWindowResize.bind(this), false);

        // Initialize perspective camera
        let perspective = 1000;
        const fov = (180 * (2 * Math.atan(this.viewport.height / 2 / perspective))) / Math.PI; // see fov image for a picture breakdown of this fov setting.
        this.camera = new THREE.PerspectiveCamera(fov, this.viewport.aspectRatio, 1, 1000)
        this.camera.position.set(0, 0, perspective); // set the camera position on the z axis.
    }

    setupRenderer() {
        // renderer
        // this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.viewport.width, this.viewport.height); // uses the getter viewport function above to set size of canvas / renderer
        this.renderer.setPixelRatio(window.devicePixelRatio); // Import to ensure image textures do not appear blurred.
        this.container.appendChild(this.renderer.domElement); // append the canvas to the main element
    }

    onWindowResize() {
        this.camera.aspect = this.viewport.aspectRatio; // readjust the aspect ratio.
        this.camera.updateProjectionMatrix(); // Used to recalulate projectin dimensions.
        this.renderer.setSize(this.viewport.width, this.viewport.height);
    }


    setActivePicture(pictureIndex) {
        this.activePicture = pictureIndex;
        this.images.forEach((img, index) => img.setActive(pictureIndex === index));
    }


    render() {

        this.renderer.render(this.scene, this.camera)
        requestAnimationFrame(this.render.bind(this));
    }
}