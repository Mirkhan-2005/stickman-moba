import * as THREE from 'three'

import { Stickman } from '../player/Stickman'
import { Joystick } from '../input/Joystick'
import { PlayerController } from '../input/PlayerController'
import { MobaCamera } from '../camera/MobaCamera'
import { GameMap } from '../world/GameMap'


export class Game {

    private readonly scene =
        new THREE.Scene()


    private readonly renderer:
        THREE.WebGLRenderer


    private readonly camera:
        MobaCamera


    private readonly gameMap:
        GameMap


    private readonly player:
        Stickman


    private readonly joystick:
        Joystick


    private readonly playerController:
        PlayerController


    private readonly clock =
        new THREE.Clock()


    constructor() {

        // ==========================================
        // Scene
        // ==========================================

        this.scene.background =
            new THREE.Color(
                0x050608
            )


        // ==========================================
        // Renderer
        // ==========================================

        this.renderer =
            new THREE.WebGLRenderer({
                antialias: true
            })


        this.renderer.setSize(
            window.innerWidth,
            window.innerHeight
        )


        this.renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio,
                2
            )
        )


        this.renderer.shadowMap.enabled =
            true


        this.renderer.shadowMap.type =
            THREE.PCFSoftShadowMap


        document.body.appendChild(
            this.renderer.domElement
        )


        // ==========================================
        // Lights
        // ==========================================

        this.createLights()


        // ==========================================
        // Map
        // ==========================================

        this.gameMap =
            new GameMap()


        this.scene.add(
            this.gameMap.group
        )


        // ==========================================
        // Player
        // ==========================================

        this.player =
            new Stickman(
                0x17bfff
            )


        this.scene.add(
            this.player.group
        )


        // ==========================================
        // Joystick
        // ==========================================

        this.joystick =
            new Joystick()


        // ==========================================
        // Controller
        // ==========================================

        this.playerController =
            new PlayerController(
                this.player,
                this.joystick,
                this.gameMap
            )


        // ==========================================
        // Camera
        // ==========================================

        this.camera =
            new MobaCamera()


        // ==========================================
        // Resize
        // ==========================================

        window.addEventListener(
            'resize',
            this.handleResize
        )
    }


    // ==============================================
    // Lights
    // ==============================================

    private createLights() {

        const hemisphereLight =
            new THREE.HemisphereLight(
                0x99bbff,
                0x101018,
                2
            )


        this.scene.add(
            hemisphereLight
        )


        const directionalLight =
            new THREE.DirectionalLight(
                0xffffff,
                3
            )


        directionalLight.position.set(
            -5,
            12,
            8
        )


        directionalLight.castShadow =
            true


        this.scene.add(
            directionalLight
        )
    }


    // ==============================================
    // Start
    // ==============================================

    public start() {

        this.clock.start()

        this.animate()
    }


    // ==============================================
    // Main game loop
    // ==============================================

    private animate =
        () => {

            requestAnimationFrame(
                this.animate
            )


            const dt =
                Math.min(
                    this.clock.getDelta(),
                    0.033
                )


            // Player

            this.playerController.update(
                dt
            )


            // Camera

            this.camera.update(
                dt,
                this.player.group
            )


            // Render

            this.renderer.render(
                this.scene,
                this.camera.camera
            )
        }


    // ==============================================
    // Resize
    // ==============================================

    private handleResize =
        () => {

            this.camera.resize()


            this.renderer.setSize(
                window.innerWidth,
                window.innerHeight
            )


            this.renderer.setPixelRatio(
                Math.min(
                    window.devicePixelRatio,
                    2
                )
            )
        }
}