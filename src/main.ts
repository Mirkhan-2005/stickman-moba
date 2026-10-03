import * as THREE from 'three'

import './style.css'

import { Stickman } from './player/Stickman'

import { Joystick } from './input/Joystick'


// ======================================================
// Scene
// ======================================================





const scene =
    new THREE.Scene()


scene.background =
    new THREE.Color(
        0x050608
    )


// ======================================================
// Camera
// ======================================================

const camera =
    new THREE.PerspectiveCamera(
        50,

        window.innerWidth /
        window.innerHeight,

        0.1,

        1000
    )


// ======================================================
// Renderer
// ======================================================

const renderer =
    new THREE.WebGLRenderer({
        antialias: true
    })


renderer.setSize(
    window.innerWidth,
    window.innerHeight
)


renderer.setPixelRatio(
    Math.min(
        window.devicePixelRatio,
        2
    )
)


renderer.shadowMap.enabled =
    true


document.body.appendChild(
    renderer.domElement
)


// ======================================================
// Lights
// ======================================================

const hemisphereLight =
    new THREE.HemisphereLight(
        0x99bbff,
        0x101018,
        2
    )


scene.add(
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


scene.add(
    directionalLight
)


// ======================================================
// Map
// ======================================================

const ground =
    new THREE.Mesh(

        new THREE.PlaneGeometry(
            60,
            40
        ),

        new THREE.MeshStandardMaterial({
            color: 0x0b0d12,
            roughness: 0.9
        })
    )


ground.rotation.x =
    -Math.PI / 2


ground.receiveShadow =
    true


scene.add(
    ground
)


// ======================================================
// Grid
// ======================================================

const grid =
    new THREE.GridHelper(
        60,
        30,

        0x25304a,
        0x151923
    )


grid.position.y =
    0.01


scene.add(
    grid
)


// ======================================================
// Stickman
// ======================================================

const player =
    new Stickman(
        0x17bfff
    )
animate()
const joystick =
    new Joystick()

scene.add(
    player.group
)


// ======================================================
// Movement
// ======================================================

const keys: Record<string, boolean> =
    {}


window.addEventListener(
    'keydown',
    (event) => {

        keys[event.key.toLowerCase()] =
            true
    }
)


window.addEventListener(
    'keyup',
    (event) => {

        keys[event.key.toLowerCase()] =
            false
    }
)


const velocity =
    new THREE.Vector3()


const direction =
    new THREE.Vector3()


const MOVE_SPEED =
    5.5


const ACCELERATION =
    12


let currentAngle =
    0


// ======================================================
// Clock
// ======================================================

const clock =
    new THREE.Clock()


// ======================================================
// Animation
// ======================================================

function animate() {

    requestAnimationFrame(
        animate
    )


    const dt =
        Math.min(
            clock.getDelta(),
            0.033
        )


    // ==============================================
    // Input
    // ==============================================

    let inputX =
        0


    let inputZ =
        0


    if (
        keys['w'] ||
        keys['arrowup']
    ) {

        inputZ -= 1
    }


    if (
        keys['s'] ||
        keys['arrowdown']
    ) {

        inputZ += 1
    }


    if (
        keys['a'] ||
        keys['arrowleft']
    ) {

        inputX -= 1
    }


    if (
        keys['d'] ||
        keys['arrowright']
    ) {

        inputX += 1
    }


    direction.set(
        inputX,
        0,
        inputZ
    )


    if (
        direction.length() > 1
    ) {

        direction.normalize()
    }


    // ==============================================
    // Desired velocity
    // ==============================================

    const desiredVelocity =
        direction
            .clone()
            .multiplyScalar(
                MOVE_SPEED
            )


    // ==============================================
    // Smooth acceleration
    // ==============================================

    const acceleration =
        1 -
        Math.exp(
            -ACCELERATION *
            dt
        )


    velocity.lerp(
        desiredVelocity,
        acceleration
    )


    // ==============================================
    // Move
    // ==============================================

    player.group.position.x +=
        velocity.x * dt


    player.group.position.z +=
        velocity.z * dt


    // ==============================================
    // Rotate player
    // ==============================================

    if (
        direction.lengthSq() >
        0.01
    ) {

        const targetAngle =
            Math.atan2(
                direction.x,
                direction.z
            )


        let difference =
            targetAngle -
            currentAngle


        difference =
            Math.atan2(
                Math.sin(difference),
                Math.cos(difference)
            )


        currentAngle +=
            difference *
            (
                1 -
                Math.exp(
                    -12 * dt
                )
            )


        player.group.rotation.y =
            currentAngle
    }


    // ==============================================
    // Player animation
    // ==============================================

    const speed =
        velocity.length()


    player.update(
        dt,
        speed
    )


    // ==============================================
    // Camera follow
    // ==============================================

    const playerPosition =
        player.group.position


    const cameraTarget =
        new THREE.Vector3(

            playerPosition.x,

            14,

            playerPosition.z + 16
        )


    camera.position.lerp(

        cameraTarget,

        1 -
        Math.exp(
            -5 * dt
        )
    )


    camera.lookAt(

        playerPosition.x,

        1,

        playerPosition.z - 2
    )


    // ==============================================
    // Render
    // ==============================================

    renderer.render(
        scene,
        camera
    )
}


animate()


// ======================================================
// Resize
// ======================================================

window.addEventListener(
    'resize',
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight


        camera.updateProjectionMatrix()


        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        )
    }
)

