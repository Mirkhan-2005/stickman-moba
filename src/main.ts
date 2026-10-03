import * as THREE from 'three'
import './style.css'

import { Joystick } from './input/Joystick'
import { MobaUnit } from './player/MobaUnit'

// ======================================================
// Scene
// ======================================================

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x050608)

// ======================================================
// Camera
// ======================================================

const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)

camera.position.set(0, 14, 16)

// ======================================================
// Renderer
// ======================================================

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

document.body.appendChild(renderer.domElement)

// ======================================================
// Lights
// ======================================================

scene.add(new THREE.HemisphereLight(0x99bbff, 0x101018, 2))

const directionalLight = new THREE.DirectionalLight(0xffffff, 3)
directionalLight.position.set(-5, 12, 8)
directionalLight.castShadow = true
scene.add(directionalLight)

// ======================================================
// Map
// ======================================================

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 40),
    new THREE.MeshStandardMaterial({
        color: 0x0b0d12,
        roughness: 0.9
    })
)

ground.rotation.x = -Math.PI / 2
ground.receiveShadow = true
scene.add(ground)

const grid = new THREE.GridHelper(
    60,
    30,
    0x25304a,
    0x151923
)

grid.position.y = 0.01
scene.add(grid)

// ======================================================
// Units
// ======================================================

const playerUnit = new MobaUnit(
    'Player',
    1,
    'ally',
    0x17bfff,
    100
)

playerUnit.setPosition(0, 4)
scene.add(playerUnit.group)

const allyOne = new MobaUnit(
    'Nova',
    1,
    'ally',
    0x39d98a,
    100
)
allyOne.setPosition(-5, 0)
scene.add(allyOne.group)

const allyTwo = new MobaUnit(
    'Volt',
    1,
    'ally',
    0x7b8cff,
    100
)
allyTwo.setPosition(5, 0)
scene.add(allyTwo.group)

const enemyOne = new MobaUnit(
    'Raze',
    1,
    'enemy',
    0xff4a4a,
    100
)
enemyOne.setPosition(-5, -8)
scene.add(enemyOne.group)

const enemyTwo = new MobaUnit(
    'Blaze',
    1,
    'enemy',
    0xff7a38,
    100
)
enemyTwo.setPosition(5, -8)
scene.add(enemyTwo.group)

const units = [
    playerUnit,
    allyOne,
    allyTwo,
    enemyOne,
    enemyTwo
]

// ======================================================
// Input
// ======================================================

const joystick = new Joystick()
const keys: Record<string, boolean> = {}

window.addEventListener('keydown', (event) => {
    keys[event.key.toLowerCase()] = true
})

window.addEventListener('keyup', (event) => {
    keys[event.key.toLowerCase()] = false
})

// ======================================================
// Movement
// ======================================================

const velocity = new THREE.Vector3()
const direction = new THREE.Vector3()
const desiredVelocity = new THREE.Vector3()

const cameraTarget = new THREE.Vector3()
const cameraLookTarget = new THREE.Vector3()

const MOVE_SPEED = 5.5
const ACCELERATION = 12
const ROTATION_SPEED = 12

const MAP_LIMIT_X = 28
const MAP_LIMIT_Z = 18

let currentAngle = 0

const clock = new THREE.Clock()

// ======================================================
// Main loop
// ======================================================

function animate() {
    requestAnimationFrame(animate)

    const dt = Math.min(clock.getDelta(), 0.033)

    let inputX = joystick.direction.x
    let inputZ = joystick.direction.y

    if (keys['w'] || keys['arrowup']) inputZ -= 1
    if (keys['s'] || keys['arrowdown']) inputZ += 1
    if (keys['a'] || keys['arrowleft']) inputX -= 1
    if (keys['d'] || keys['arrowright']) inputX += 1

    direction.set(inputX, 0, inputZ)

    if (direction.lengthSq() > 1) {
        direction.normalize()
    }

    desiredVelocity
        .copy(direction)
        .multiplyScalar(MOVE_SPEED)

    const accelerationFactor =
        1 - Math.exp(-ACCELERATION * dt)

    velocity.lerp(desiredVelocity, accelerationFactor)

    playerUnit.group.position.x += velocity.x * dt
    playerUnit.group.position.z += velocity.z * dt

    playerUnit.group.position.x = THREE.MathUtils.clamp(
        playerUnit.group.position.x,
        -MAP_LIMIT_X,
        MAP_LIMIT_X
    )

    playerUnit.group.position.z = THREE.MathUtils.clamp(
        playerUnit.group.position.z,
        -MAP_LIMIT_Z,
        MAP_LIMIT_Z
    )

    if (direction.lengthSq() > 0.001) {
        const targetAngle = Math.atan2(direction.x, direction.z)

        let difference = targetAngle - currentAngle
        difference = Math.atan2(
            Math.sin(difference),
            Math.cos(difference)
        )

        const rotationFactor =
            1 - Math.exp(-ROTATION_SPEED * dt)

        currentAngle += difference * rotationFactor
        playerUnit.group.rotation.y = currentAngle
    }

    playerUnit.update(dt, velocity.length())
    allyOne.update(dt)
    allyTwo.update(dt)
    enemyOne.update(dt)
    enemyTwo.update(dt)

    const playerPosition = playerUnit.group.position

    cameraTarget.set(
        playerPosition.x,
        14,
        playerPosition.z + 16
    )

    camera.position.lerp(
        cameraTarget,
        1 - Math.exp(-5 * dt)
    )

    cameraLookTarget.set(
        playerPosition.x,
        1,
        playerPosition.z - 2
    )

    camera.lookAt(cameraLookTarget)

    for (const unit of units) {
        unit.updateUI(camera)
    }

    renderer.render(scene, camera)
}

animate()

// ======================================================
// Resize
// ======================================================

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
