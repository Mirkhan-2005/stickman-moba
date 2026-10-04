import * as THREE from 'three'

import { MobaUnit } from '../player/MobaUnit'
import { Joystick } from '../input/Joystick'
import { PlayerController } from '../input/PlayerController'
import { MobaCamera } from '../camera/MobaCamera'
import { GameMap } from '../world/GameMap'
import { AttackSystem } from '../combat/AttackSystem'
import { BotController } from '../bots/BotController'

export class Game {

    private readonly scene =
        new THREE.Scene()

    private readonly renderer:
        THREE.WebGLRenderer

    private readonly camera:
        MobaCamera

    private readonly gameMap:
        GameMap

    private readonly joystick:
        Joystick

    private readonly playerController:
        PlayerController

    private readonly player:
        MobaUnit


    // Все персонажи
    private readonly units:
        MobaUnit[] =
        []


    // Союзники
    private readonly allies:
        MobaUnit[] =
        []


    // Враги
    private readonly enemies:
        MobaUnit[] =
        []

    private readonly enemyBots:
        BotController[] =
        []


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
        // PLAYER
        // ==========================================

        this.player =
            this.createUnit(
                'Player',
                1,
                'ally',
                0x17bfff,
                0,
                4
            )


        // ==========================================
        // ALLIES
        // ==========================================

        const ally1 =
            this.createUnit(
                'Nova',
                1,
                'ally',
                0x479cff,
                -5,
                0
            )


        const ally2 =
            this.createUnit(
                'Volt',
                1,
                'ally',
                0x716cff,
                5,
                0
            )


        this.allies.push(
            ally1,
            ally2
        )


        // ==========================================
        // ENEMIES
        // ==========================================

        const enemy1 =
            this.createUnit(
                'Raze',
                1,
                'enemy',
                0xff3d4d,
                -5,
                -8
            )


        const enemy2 =
            this.createUnit(
                'Blaze',
                1,
                'enemy',
                0xff643d,
                5,
                -8
            )


        this.enemies.push(
            enemy1,
            enemy2
        )


        // ==========================================
        // Joystick
        // ==========================================

        this.joystick =
            new Joystick()


        // ==========================================
        // Player Controller
        // ==========================================

        this.playerController =
            new PlayerController(

                // MobaUnit содержит Stickman
                this.player,

                this.joystick,

                this.gameMap
            )



            new AttackSystem(
                this.player,
                this.enemies
            )


        this.enemyBots.push(

            new BotController(
                enemy1,
                this.player,
                this.gameMap
            ),

            new BotController(
                enemy2,
                this.player,
                this.gameMap
            )
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
    // Create Unit
    // ==============================================

    private createUnit(
        name: string,
        level: number,
        team: 'ally' | 'enemy',
        color: number,
        x: number,
        z: number
    ): MobaUnit {

        const unit =
            new MobaUnit(
                name,
                level,
                team,
                color,
                100
            )


        unit.setPosition(
            x,
            z
        )


        this.scene.add(
            unit.group
        )


        this.units.push(
            unit
        )


        return unit
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
    // Main Game Loop
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


            // ======================================
            // Player movement
            // ======================================

            this.playerController.update(
                dt
            )


            // ======================================
            // Allies idle animation
            // ======================================

            for (
                const ally
                of this.allies
            ) {

                ally.update(
                    dt
                )
            }


            // ======================================
            // Enemies idle animation
            // ======================================


            // ======================================
            // Camera
            // ======================================

            this.camera.update(
                dt,
                this.player.group
            )


            // Нужно для правильного
            // преобразования 3D → экран
            this.camera.camera
                .updateMatrixWorld()


            // ======================================
            // Unit UI
            // ======================================

            for (
                const unit
                of this.units
            ) {

                unit.updateUI(
                    this.camera.camera
                )
            }


            // ======================================
            // Render
            // ======================================

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