import * as THREE from 'three'

import { Stickman } from './Stickman'


export type Team =
    'ally' |
    'enemy'


export class MobaUnit {

    public readonly group:
        THREE.Group

    public readonly stickman:
        Stickman

    public readonly name:
        string

    public readonly level:
        number

    public readonly team:
        Team

    public readonly maxHealth:
        number


    public health:
        number


    private readonly ui:
        HTMLDivElement

    private readonly healthFill:
        HTMLDivElement

    private readonly uiWorldPosition =
        new THREE.Vector3()


    constructor(
        name: string,
        level: number,
        team: Team,
        color: number,
        maxHealth: number = 100
    ) {

        this.name =
            name

        this.level =
            level

        this.team =
            team

        this.maxHealth =
            maxHealth

        this.health =
            maxHealth


        // ==============================================
        // Stickman
        // ==============================================

        this.stickman =
            new Stickman(
                color
            )


        this.group =
            this.stickman.group


        // ==============================================
        // UI container
        // ==============================================

        this.ui =
            document.createElement(
                'div'
            )


        this.ui.className =
            `unit-ui ${team}`


        // ==============================================
        // Name + level
        // ==============================================

        const title =
            document.createElement(
                'div'
            )


        title.className =
            'unit-title'


        const levelElement =
            document.createElement(
                'span'
            )


        levelElement.className =
            'unit-level'


        levelElement.textContent =
            String(
                this.level
            )


        const nameElement =
            document.createElement(
                'span'
            )


        nameElement.className =
            'unit-name'


        nameElement.textContent =
            this.name


        title.appendChild(
            levelElement
        )


        title.appendChild(
            nameElement
        )


        // ==============================================
        // Health bar
        // ==============================================

        const healthBar =
            document.createElement(
                'div'
            )


        healthBar.className =
            'unit-health'


        this.healthFill =
            document.createElement(
                'div'
            )


        this.healthFill.className =
            'unit-health-fill'


        healthBar.appendChild(
            this.healthFill
        )


        // ==============================================
        // Assemble UI
        // ==============================================

        this.ui.appendChild(
            title
        )


        this.ui.appendChild(
            healthBar
        )


        document.body.appendChild(
            this.ui
        )


        this.updateHealthBar()
    }


    // ==============================================
    // Position
    // ==============================================




    public setPosition(
    x: number,
    z: number
    ) {

        this.group.position.set(
            x,
            0,
            z
        )


        this.spawnPosition.copy(
            this.group.position
        )
    }


    // ==============================================
    // Animation
    // ==============================================



    public update(
    dt: number,
    speed: number = 0
    ) {

        // ==========================================
        // Dead
        // ==========================================

        if (
            this.dead
        ) {

            this.respawnTimer -=
                dt


            if (
                this.respawnTimer <=
                0
            ) {

                this.respawn()
            }


            return
        }


        // ==========================================
        // Animation
        // ==========================================

        this.stickman.update(
            dt,
            speed
        )
    }


    // ==============================================
    // Damage
    // ==============================================






    public takeDamage(
    damage: number
    ) {

        if (
            this.dead
        ) {

            return
        }


        this.health =
            THREE.MathUtils.clamp(
                this.health -
                damage,

                0,

                this.maxHealth
            )


        this.updateHealthBar()


        if (
            this.health <=
            0
        ) {

            this.die()
        }
    }

    // ==============================================
    // Health
    // ==============================================

    public setHealth(
        health: number
    ) {

        this.health =
            THREE.MathUtils.clamp(
                health,

                0,

                this.maxHealth
            )


        this.updateHealthBar()
    }




    public isDead(): boolean {

    return this.dead
}

    private dead =
    false


    private respawnTimer =
        0


    private readonly respawnDelay =
        5


    private readonly spawnPosition =
        new THREE.Vector3()




    private updateHealthBar() {

        const percentage =
            (
                this.health /
                this.maxHealth
            ) * 100


        this.healthFill.style.width =
            `${percentage}%`
    }



    private die() {

    this.dead =
        true


    this.respawnTimer =
        this.respawnDelay


    // персонаж исчезает
    this.group.visible =
        false


    // UI исчезает
    this.ui.style.display =
        'none'
    }


    private respawn() {

        this.dead =
            false


        this.health =
            this.maxHealth


        this.updateHealthBar()


        // Возвращаем на spawn
        this.group.position.copy(
            this.spawnPosition
        )


        this.group.visible =
            true
    }











    // ==============================================
    // UI position
    // ==============================================

    public updateUI(
        camera:
            THREE.Camera
    ) {

    if (
        this.dead
    ) {

        this.ui.style.display =
            'none'

        return
    }

        // Position above head

        this.uiWorldPosition.set(
            0,
            3.35,
            0
        )


        this.group.localToWorld(
            this.uiWorldPosition
        )


        this.uiWorldPosition.project(
            camera
        )


        // Hide when unit is behind camera

        if (
            this.uiWorldPosition.z <
                -1 ||
            this.uiWorldPosition.z >
                1
        ) {

            this.ui.style.display =
                'none'

            return
        }


        this.ui.style.display =
            'block'


        const x =
            (
                this.uiWorldPosition.x *
                0.5 +
                0.5
            ) *
            window.innerWidth


        const y =
            (
                -this.uiWorldPosition.y *
                0.5 +
                0.5
            ) *
            window.innerHeight


        this.ui.style.transform =
            `translate(-50%, -100%) translate(${x}px, ${y}px)`
    }
}