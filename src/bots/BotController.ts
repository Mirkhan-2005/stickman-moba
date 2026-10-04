import * as THREE from 'three'

import { MobaUnit } from '../player/MobaUnit'
import { GameMap } from '../world/GameMap'


export class BotController {

    private readonly bot:
        MobaUnit

    private readonly target:
        MobaUnit

    private readonly gameMap:
        GameMap


    private readonly velocity =
        new THREE.Vector3()

    private readonly zeroVelocity =
        new THREE.Vector3()

    private readonly direction =
        new THREE.Vector3()


    private readonly desiredVelocity =
        new THREE.Vector3()


    // Насколько далеко бот видит игрока
    private readonly detectionRange =
        9


    // Дистанция атаки
    private readonly attackRange =
        2.2


    private readonly moveSpeed =
        2.6


    private readonly acceleration =
        8


    // 10 HP за удар
    private readonly damage =
        10


    // секунд между атаками
    private readonly attackCooldown =
        1.1


    private attackCooldownRemaining =
        0


    constructor(
        bot: MobaUnit,
        target: MobaUnit,
        gameMap: GameMap
    ) {

        this.bot =
            bot

        this.target =
            target

        this.gameMap =
            gameMap
    }


    // ==============================================
    // Update
    // ==============================================

    public update(
        dt: number
    ) {

        // ==========================================
        // Cooldown
        // ==========================================

        this.attackCooldownRemaining =
            Math.max(
                0,

                this.attackCooldownRemaining -
                dt
            )


        // ==========================================
        // Bot dead
        // ==========================================

        if (
            this.bot.isDead()
        ) {

            this.velocity.set(
                0,
                0,
                0
            )


            // Respawn timer
            this.bot.update(
                dt,
                0
            )


            return
        }


        // ==========================================
        // Player dead
        // ==========================================

        if (
            this.target.isDead()
        ) {

            this.stop(
                dt
            )

            return
        }


        const dx =
            this.target.group.position.x -
            this.bot.group.position.x


        const dz =
            this.target.group.position.z -
            this.bot.group.position.z


        const distanceSquared =
            dx * dx +
            dz * dz


        // ==========================================
        // Player too far
        // ==========================================

        if (
            distanceSquared >
            this.detectionRange *
            this.detectionRange
        ) {

            this.stop(
                dt
            )

            return
        }


        // ==========================================
        // Face player
        // ==========================================

        this.faceTarget(
            dt
        )


        // ==========================================
        // Attack
        // ==========================================

        if (
            distanceSquared <=
            this.attackRange *
            this.attackRange
        ) {

            this.stop(
                dt
            )


            this.tryAttack()


            return
        }


        // ==========================================
        // Chase player
        // ==========================================

        this.direction.set(
            dx,
            0,
            dz
        )


        if (
            this.direction.lengthSq() >
            0
        ) {

            this.direction.normalize()
        }


        this.desiredVelocity
            .copy(
                this.direction
            )
            .multiplyScalar(
                this.moveSpeed
            )


        const smooth =
            1 -
            Math.exp(
                -this.acceleration *
                dt
            )


        this.velocity.lerp(
            this.desiredVelocity,
            smooth
        )


        this.bot.group.position.x +=
            this.velocity.x *
            dt


        this.bot.group.position.z +=
            this.velocity.z *
            dt


        this.gameMap.clampPosition(
            this.bot.group.position
        )


        this.bot.update(
            dt,
            this.velocity.length()
        )
    }


    // ==============================================
    // Stop
    // ==============================================

    private stop(
        dt: number
    ) {

        const smooth =
            1 -
            Math.exp(
                -10 *
                dt
            )


        this.velocity.lerp(
            new THREE.Vector3(
                0,
                0,
                0
            ),
            smooth
        )

        this.velocity.lerp(
            this.zeroVelocity,
            smooth
        )


        this.bot.update(
            dt,
            this.velocity.length()
        )
    }


    // ==============================================
    // Rotate toward player
    // ==============================================

    private faceTarget(
        dt: number
    ) {

        const dx =
            this.target.group.position.x -
            this.bot.group.position.x


        const dz =
            this.target.group.position.z -
            this.bot.group.position.z


        const targetAngle =
            Math.atan2(
                dx,
                dz
            )


        const currentAngle =
            this.bot.group.rotation.y


        let difference =
            targetAngle -
            currentAngle


        difference =
            Math.atan2(
                Math.sin(
                    difference
                ),

                Math.cos(
                    difference
                )
            )


        this.bot.group.rotation.y +=
            difference *
            (
                1 -
                Math.exp(
                    -10 *
                    dt
                )
            )
    }


    // ==============================================
    // Attack
    // ==============================================

    private tryAttack() {

        if (
            this.attackCooldownRemaining >
            0
        ) {

            return
        }


        this.attackCooldownRemaining =
            this.attackCooldown


        this.bot.stickman
            .playAttack()


        // Наносим урон в момент удара рукой
        setTimeout(
            () => {

                if (
                    this.bot.isDead() ||
                    this.target.isDead()
                ) {

                    return
                }


                this.target.takeDamage(
                    this.damage
                )

            },

            120
        )
    }
}