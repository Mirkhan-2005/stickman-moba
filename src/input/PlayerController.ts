import * as THREE from 'three'

import { Stickman } from '../player/Stickman'
import { Joystick } from './Joystick'
import { GameMap } from '../world/GameMap'


export class PlayerController {

    private readonly player:
        Stickman


    private readonly joystick:
        Joystick


    private readonly gameMap:
        GameMap


    private readonly keys:
        Record<string, boolean> =
        {}


    private readonly velocity =
        new THREE.Vector3()


    private readonly direction =
        new THREE.Vector3()


    private readonly desiredVelocity =
        new THREE.Vector3()


    private currentAngle =
        0


    private readonly moveSpeed =
        5.5


    private readonly acceleration =
        12


    private readonly rotationSpeed =
        12


    constructor(
        player: Stickman,
        joystick: Joystick,
        gameMap: GameMap
    ) {

        this.player =
            player


        this.joystick =
            joystick


        this.gameMap =
            gameMap


        this.setupKeyboard()
    }


    // ==============================================
    // Keyboard
    // ==============================================

    private setupKeyboard() {

        window.addEventListener(
            'keydown',
            (
                event
            ) => {

                this.keys[
                    event.key.toLowerCase()
                ] = true
            }
        )


        window.addEventListener(
            'keyup',
            (
                event
            ) => {

                this.keys[
                    event.key.toLowerCase()
                ] = false
            }
        )
    }


    // ==============================================
    // Update
    // ==============================================

    public update(
        dt: number
    ) {

        let inputX =
            this.joystick.direction.x


        let inputZ =
            this.joystick.direction.y


        // ==========================================
        // Keyboard input
        // ==========================================

        if (
            this.keys['w'] ||
            this.keys['arrowup']
        ) {

            inputZ -=
                1
        }


        if (
            this.keys['s'] ||
            this.keys['arrowdown']
        ) {

            inputZ +=
                1
        }


        if (
            this.keys['a'] ||
            this.keys['arrowleft']
        ) {

            inputX -=
                1
        }


        if (
            this.keys['d'] ||
            this.keys['arrowright']
        ) {

            inputX +=
                1
        }


        // ==========================================
        // Direction
        // ==========================================

        this.direction.set(
            inputX,
            0,
            inputZ
        )


        if (
            this.direction.lengthSq() >
            1
        ) {

            this.direction.normalize()
        }


        // ==========================================
        // Desired velocity
        // ==========================================

        this.desiredVelocity
            .copy(
                this.direction
            )
            .multiplyScalar(
                this.moveSpeed
            )


        // ==========================================
        // Smooth acceleration
        // ==========================================

        const accelerationFactor =
            1 -
            Math.exp(
                -this.acceleration *
                dt
            )


        this.velocity.lerp(
            this.desiredVelocity,
            accelerationFactor
        )


        // ==========================================
        // Move
        // ==========================================

        this.player.group.position.x +=
            this.velocity.x *
            dt


        this.player.group.position.z +=
            this.velocity.z *
            dt


        // ==========================================
        // Map limits
        // ==========================================

        this.gameMap.clampPosition(
            this.player.group.position
        )


        // ==========================================
        // Rotation
        // ==========================================

        this.updateRotation(
            dt
        )


        // ==========================================
        // Stickman animation
        // ==========================================

        this.player.update(
            dt,
            this.velocity.length()
        )
    }


    // ==============================================
    // Rotation
    // ==============================================

    private updateRotation(
        dt: number
    ) {

        if (
            this.direction.lengthSq() <=
            0.001
        ) {

            return
        }


        const targetAngle =
            Math.atan2(
                this.direction.x,
                this.direction.z
            )


        let difference =
            targetAngle -
            this.currentAngle


        difference =
            Math.atan2(
                Math.sin(
                    difference
                ),

                Math.cos(
                    difference
                )
            )


        const rotationFactor =
            1 -
            Math.exp(
                -this.rotationSpeed *
                dt
            )


        this.currentAngle +=
            difference *
            rotationFactor


        this.player.group.rotation.y =
            this.currentAngle
    }


    // ==============================================
    // Useful later for combat
    // ==============================================

    public getSpeed(): number {

        return this.velocity.length()
    }


    public getDirection():
        THREE.Vector3 {

        return this.direction
    }
}