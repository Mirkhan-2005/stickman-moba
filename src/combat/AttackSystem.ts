import * as THREE from 'three'

import { MobaUnit } from '../player/MobaUnit'


export class AttackSystem {

    private readonly player:
        MobaUnit

    private readonly enemies:
        MobaUnit[]


    private readonly button:
        HTMLButtonElement


    private readonly attackRange =
        3.2


    private readonly damage =
        20


    private readonly cooldown =
        650


    private lastAttackTime =
        -Infinity


    constructor(
        player: MobaUnit,
        enemies: MobaUnit[]
    ) {

        this.player =
            player

        this.enemies =
            enemies


        // ==========================================
        // Attack button
        // ==========================================

        this.button =
            document.createElement(
                'button'
            )


        this.button.id =
            'attack-button'


        this.button.textContent =
            'ATTACK'


        document.body.appendChild(
            this.button
        )


        // ==========================================
        // Mouse / Touch
        // ==========================================

        this.button.addEventListener(
            'pointerdown',
            (
                event
            ) => {

                event.preventDefault()

                this.attack()
            }
        )


        // ==========================================
        // Keyboard
        // ==========================================

        window.addEventListener(
            'keydown',
            (
                event
            ) => {

                if (
                    event.code ===
                    'Space'
                ) {

                    event.preventDefault()

                    this.attack()
                }
            }
        )
    }


    // ==============================================
    // Attack
    // ==============================================

    public attack() {

        const now =
            performance.now()


        // Cooldown

        if (
            now -
            this.lastAttackTime <
            this.cooldown
        ) {

            return
        }


        // Find enemy

        const target =
            this.findNearestEnemy()


        if (
            !target
        ) {

            this.showTooFar()

            return
        }


        // ==========================================
        // Face enemy
        // ==========================================

        this.faceTarget(
            target
        )


        // ==========================================
        // Damage
        // ==========================================

        target.takeDamage(
            this.damage
        )


        this.lastAttackTime =
            now


        // ==========================================
        // Button cooldown
        // ==========================================

        this.startButtonCooldown()
    }


    // ==============================================
    // Find nearest enemy
    // ==============================================

    private findNearestEnemy():
        MobaUnit | null {

        let nearest:
            MobaUnit | null =
            null


        let nearestDistance =
            Infinity


        for (
            const enemy
            of this.enemies
        ) {

            if (
                enemy.isDead()
            ) {

                continue
            }


            const dx =
                enemy.group.position.x -
                this.player.group.position.x


            const dz =
                enemy.group.position.z -
                this.player.group.position.z


            const distanceSquared =
                dx * dx +
                dz * dz


            if (
                distanceSquared <
                nearestDistance
            ) {

                nearestDistance =
                    distanceSquared


                nearest =
                    enemy
            }
        }


        if (
            !nearest
        ) {

            return null
        }


        const rangeSquared =
            this.attackRange *
            this.attackRange


        if (
            nearestDistance >
            rangeSquared
        ) {

            return null
        }


        return nearest
    }


    // ==============================================
    // Face target
    // ==============================================

    private faceTarget(
        target: MobaUnit
    ) {

        const dx =
            target.group.position.x -
            this.player.group.position.x


        const dz =
            target.group.position.z -
            this.player.group.position.z


        const angle =
            Math.atan2(
                dx,
                dz
            )


        this.player.group.rotation.y =
            angle
    }


    // ==============================================
    // Cooldown UI
    // ==============================================

    private startButtonCooldown() {

        this.button.disabled =
            true


        this.button.classList.add(
            'cooldown'
        )


        setTimeout(
            () => {

                this.button.disabled =
                    false


                this.button.classList.remove(
                    'cooldown'
                )

            },

            this.cooldown
        )
    }


    // ==============================================
    // Too far
    // ==============================================

    private showTooFar() {

        const oldText =
            this.button.textContent


        this.button.textContent =
            'TOO FAR'


        this.button.classList.add(
            'too-far'
        )


        setTimeout(
            () => {

                this.button.textContent =
                    oldText


                this.button.classList.remove(
                    'too-far'
                )

            },

            350
        )
    }
}