import * as THREE from 'three';
import vertexShader from './shader/glitch.vert';
import fragmentShader from './shader/glitch.frag';
import { lerp } from './utils';

export default class {

    initPosition = { x: 0, y: 0 }
    divider = 10;

    constructor({ element, scene, id, active = true }) {
        this.element = element; //orinial img element
        this.scene = scene; //parent Glitch gl scene 
        this.id = id; //id in list, will be used to be updated
        this.active = active;
        this.offset = new THREE.Vector2(0, 0); // Positions of mesh on screen. Will be updated below.
        this.sizes = new THREE.Vector2(0, 0); //Size of mesh on screen. Will be updated below.
    }


    getDimensions() {
        const { width, height, top, left } = this.element.getBoundingClientRect();
        this.sizes.set(width, height);
        this.offset.set(left - window.innerWidth / 2 + width / 2, -top + window.innerHeight / 2 - height / 2);
    }

    onMouseMove({ event, picture }) {
        if (picture.active) {
            const newX = (event.pageX - picture.initPosition.x) / this.divider;
            const newY = (event.pageY - picture.initPosition.y) / this.divider;
            picture.element.style.transform = `translate3d(${newX}px,${newY}px, 0)`;
        }
    }

    setActive(active) {
        this.active = active;
        this.updateState(active && "SHOW" || "HIDE");
    }

    updateState(command) {

        switch (command) {

            case 'INIT':
                this.element.classList.add("glitch-gl-pictures-item");
                break;

            case 'SHOW':
                this.element.classList.remove("hide");
                break;

            case 'HIDE':
                this.element.classList.add("hide");
                break;
        }
    }

    init() {

        //set CSS & Event movement
        this.updateState("INIT");
        this.initPosition.x = this.element.getBoundingClientRect().left;
        this.initPosition.y = this.element.getBoundingClientRect().top;
        window.addEventListener('mousemove', (e) => this.onMouseMove({ event: e, picture: this }));

        //generate mesh
        this.geometry = new THREE.PlaneGeometry(1, 1, 100, 100);
        this.imageTexture = new THREE.TextureLoader().load(this.element.src);
        this.uniforms = {
            uTexture: {
                //texture data
                value: this.imageTexture
            },
            uOffset: {
                //distortion strength
                value: new THREE.Vector2(0.0, 0.0)
            },
            uAlpha: {
                //opacity
                value: 1.
            }
        };
        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            // wireframe: true,
            side: THREE.DoubleSide
        })
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.getDimensions(); // set offsetand sizes for placement on the scene
        this.mesh.position.set(this.offset.x, this.offset.y, 0);
        this.mesh.scale.set(this.sizes.x, this.sizes.y, 1);

        this.scene.add(this.mesh);
    }

    render() {
        // this function is repeatidly called for each instance in the aboce 
        this.getDimensions();
        this.mesh.position.set(this.offset.x, this.offset.y, 0)
        this.mesh.scale.set(this.sizes.x, this.sizes.y, 1)
        this.uniforms.uOffset.value.set(this.offset.x * 0.0, -(target - current) * 0.0003)
    }


}