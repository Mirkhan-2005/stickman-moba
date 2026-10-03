import * as THREE from 'three'
import { Stickman } from './Stickman'

export type Team = 'ally' | 'enemy'

export class MobaUnit {
    public readonly stickman: Stickman
    public readonly group: THREE.Group

    public health: number
    public readonly maxHealth: number

    private readonly label: HTMLDivElement
    private readonly healthFill: HTMLDivElement
    private readonly screenPosition = new THREE.Vector3()

    constructor(
        public readonly name: string,
        public readonly level: number,
        public readonly team: Team,
        color: number,
        maxHealth: number = 100
    ) {
        this.stickman = new Stickman(color)
        this.group = this.stickman.group

        this.maxHealth = maxHealth
        this.health = maxHealth

        this.label = document.createElement('div')
        this.label.className = `unit-label unit-label--${team}`

        const title = document.createElement('div')
        title.className = 'unit-title'
        title.textContent = `Lv.${level} ${name}`

        const healthBar = document.createElement('div')
        healthBar.className = 'unit-health'

        this.healthFill = document.createElement('div')
        this.healthFill.className = 'unit-health-fill'

        healthBar.appendChild(this.healthFill)
        this.label.appendChild(title)
        this.label.appendChild(healthBar)
        document.body.appendChild(this.label)
    }

    public setPosition(x: number, z: number): void {
        this.group.position.set(x, 0, z)
    }

    public update(dt: number, speed: number = 0): void {
        this.stickman.update(dt, speed)
    }

    public setHealth(value: number): void {
        this.health = THREE.MathUtils.clamp(value, 0, this.maxHealth)
        const percent = (this.health / this.maxHealth) * 100
        this.healthFill.style.width = `${percent}%`
    }

    public updateUI(camera: THREE.Camera): void {
        this.screenPosition.copy(this.group.position)
        this.screenPosition.y += 3.35
        this.screenPosition.project(camera)

        const visible =
            this.screenPosition.z > -1 &&
            this.screenPosition.z < 1

        this.label.style.display = visible ? 'block' : 'none'

        if (!visible) {
            return
        }

        const x = (this.screenPosition.x * 0.5 + 0.5) * window.innerWidth
        const y = (-this.screenPosition.y * 0.5 + 0.5) * window.innerHeight

        this.label.style.transform =
            `translate(-50%, -100%) translate(${x}px, ${y}px)`
    }
}
