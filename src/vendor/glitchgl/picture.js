import * as THREE from 'three';
import vertexShader from './shader/glitch.vert';
import fragmentShader from './shader/glitch.frag';
import { lerp, interpolators } from './utils';

export default class {

    initPosition = { x: 0, y: 0 };
    currentPosition = { x: 0, y: 0 };
    lastMovement = 0;
    ease = 0.2;
    divider = 1;

    constructor({ element, scene, container, id, active = true }) {
        this.element = element; //orinial img element
        this.scene = scene; //parent Glitch gl scene 
        this.id = id; //id in list, will be used to be updated
        this.active = active;
        this.container = container;
        this.offset = new THREE.Vector2(0, 0); // Positions of mesh on screen. Will be updated below.
        this.sizes = new THREE.Vector2(0, 0); //Size of mesh on screen. Will be updated below.
    }

    get elementDimension(){
        return this.element.getBoundingClientRect();
    }


    getDimensions() {
        const { width, height, top, left } = this.elementDimension;
        const containerDimension = this.container.getBoundingClientRect();
        this.sizes.set(width, height);
        this.offset.set(left - window.innerWidth / 2 + width / 2, -top + window.innerHeight / 2 - height / 2);
        //this.offset.set(left - containerDimension.width/4, -1*top);
    }

    onMouseMove({ event, picture }) {
        if (picture.active) {
            const { width, height } = this.elementDimension;
            this.lastMovement = Math.abs(event.movementX * event.movementY);
            this.currentPosition.x = (event.pageX - picture.initPosition.x - width/2 ) / this.divider;
            this.currentPosition.y = -1 * (event.pageY - picture.initPosition.y - height / 2) / this.divider;

            //picture.element.style.transform = `translate3d(${this.currentPosition.x}px,${-1*this.currentPosition.y}px, 0)`;
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
                this.uniforms.uAlpha.value = 1.;
                break;

            case 'HIDE':
                this.uniforms.uAlpha.value = 0.;
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

        if (!this.active) {
            return;
        }
        // this function is repeatidly called for each instance in the above 
        this.getDimensions();
        //this.mesh.position.set(this.offset.x, this.offset.y, 0);
        this.mesh.scale.set(this.sizes.x, this.sizes.y, 1);
        this.mesh.position.x = THREE.MathUtils.lerp(this.mesh.position.x, this.currentPosition.x, interpolators.cubic(this.ease));
        this.mesh.position.y = THREE.MathUtils.lerp(this.mesh.position.y, this.currentPosition.y, interpolators.cubic(this.ease));

        /*console.log(this.lastMovement);
        if(this.lastMovement > 0){
            while(this.lastMovement > 0){
                this.lastMovement -= 1 * this.ease;
                this.uniforms.uOffset.value.set(this.offset.x * 0.0, -(this.currentPosition.x) * 0.0003);
            }
        }*/


    }


}