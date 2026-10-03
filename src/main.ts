import * as THREE from 'three'

import './style.css'

import { Stickman } from './player/Stickman'
import { Joystick } from './input/Joystick'


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


// Начальная позиция камеры.
// В animate() она потом будет следовать за игроком.
camera.position.set(
    0,
    14,
    16
)


// ======================================================
// Renderer
// ======================================================

const renderer = new THREE.WebGLRenderer({
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

renderer.shadowMap.enabled = true

renderer.shadowMap.type =
    THREE.PCFSoftShadowMap

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

directionalLight.castShadow = true

scene.add(
    directionalLight
)


// ======================================================
// Map
// ======================================================

const groundGeometry =
    new THREE.PlaneGeometry(
        60,
        40
    )


const groundMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x0b0d12,
        roughness: 0.9
    })


const ground =
    new THREE.Mesh(
        groundGeometry,
        groundMaterial
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
// Player
// ======================================================

const player =
    new Stickman(
        0x17bfff
    )


scene.add(
    player.group
)


// ======================================================
// Joystick
// ======================================================

const joystick =
    new Joystick()


// ======================================================
// Keyboard
// ======================================================

const keys: Record<string, boolean> =
    {}


window.addEventListener(
    'keydown',
    (event) => {

        keys[
            event.key.toLowerCase()
        ] = true
    }
)


window.addEventListener(
    'keyup',
    (event) => {

        keys[
            event.key.toLowerCase()
        ] = false
    }
)


// ======================================================
// Movement variables
// ======================================================

const velocity =
    new THREE.Vector3()


const direction =
    new THREE.Vector3()


const desiredVelocity =
    new THREE.Vector3()


// ======================================================
// Camera helper vectors
// ======================================================

const cameraTarget =
    new THREE.Vector3()


const cameraLookTarget =
    new THREE.Vector3()


// ======================================================
// Player settings
// ======================================================

const MOVE_SPEED =
    5.5


const ACCELERATION =
    12


const ROTATION_SPEED =
    12


// ======================================================
// Map limits
// ======================================================

const MAP_LIMIT_X =
    28


const MAP_LIMIT_Z =
    18


// ======================================================
// Player rotation
// ======================================================

let currentAngle =
    0


// ======================================================
// Clock
// ======================================================

const clock =
    new THREE.Clock()


// ======================================================
// Main game loop
// ======================================================

function animate() {

    requestAnimationFrame(
        animate
    )


    // --------------------------------------------------
    // Delta time
    // --------------------------------------------------

    const dt =
        Math.min(
            clock.getDelta(),
            0.033
        )


    // ==================================================
    // INPUT
    // ==================================================

    let inputX =
        0


    let inputZ =
        0


    // --------------------------------------------------
    // Joystick input
    //
    // joystick.direction:
    //
    // x:
    // -1 = left
    //  1 = right
    //
    // y:
    // -1 = up
    //  1 = down
    // --------------------------------------------------

    inputX +=
        joystick.direction.x


    inputZ +=
        joystick.direction.y


    // --------------------------------------------------
    // Keyboard input
    // --------------------------------------------------

    if (
        keys['w'] ||
        keys['arrowup']
    ) {

        inputZ -=
            1
    }


    if (
        keys['s'] ||
        keys['arrowdown']
    ) {

        inputZ +=
            1
    }


    if (
        keys['a'] ||
        keys['arrowleft']
    ) {

        inputX -=
            1
    }


    if (
        keys['d'] ||
        keys['arrowright']
    ) {

        inputX +=
            1
    }


    // ==================================================
    // Direction
    // ==================================================

    direction.set(
        inputX,
        0,
        inputZ
    )


    // Если одновременно работает joystick + keyboard,
    // длина вектора может стать > 1.
    //
    // Также это исправляет слишком быстрое движение
    // по диагонали.

    if (
        direction.lengthSq() >
        1
    ) {

        direction.normalize()
    }


    // ==================================================
    // Desired velocity
    // ==================================================

    desiredVelocity
        .copy(
            direction
        )
        .multiplyScalar(
            MOVE_SPEED
        )


    // ==================================================
    // Smooth acceleration / braking
    // ==================================================

    const accelerationFactor =
        1 -
        Math.exp(
            -ACCELERATION *
            dt
        )


    velocity.lerp(
        desiredVelocity,
        accelerationFactor
    )


    // ==================================================
    // Player movement
    // ==================================================

    player.group.position.x +=
        velocity.x *
        dt


    player.group.position.z +=
        velocity.z *
        dt


    // ==================================================
    // Map boundaries
    // ==================================================

    player.group.position.x =
        THREE.MathUtils.clamp(
            player.group.position.x,
            -MAP_LIMIT_X,
            MAP_LIMIT_X
        )


    player.group.position.z =
        THREE.MathUtils.clamp(
            player.group.position.z,
            -MAP_LIMIT_Z,
            MAP_LIMIT_Z
        )


    // ==================================================
    // Player rotation
    // ==================================================

    if (
        direction.lengthSq() >
        0.001
    ) {

        const targetAngle =
            Math.atan2(
                direction.x,
                direction.z
            )


        // Получаем кратчайший путь между углами,
        // чтобы персонаж не делал лишний оборот.

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


        const rotationFactor =
            1 -
            Math.exp(
                -ROTATION_SPEED *
                dt
            )


        currentAngle +=
            difference *
            rotationFactor


        player.group.rotation.y =
            currentAngle
    }


    // ==================================================
    // Stickman animation
    // ==================================================

    const speed =
        velocity.length()


    player.update(
        dt,
        speed
    )


    // ==================================================
    // Camera follow
    // ==================================================

    const playerPosition =
        player.group.position


    // Камера достаточно далеко,
    // чтобы позднее видеть союзников,
    // врагов и больше карты.

    cameraTarget.set(
        playerPosition.x,
        14,
        playerPosition.z + 16
    )


    const cameraSmooth =
        1 -
        Math.exp(
            -5 *
            dt
        )


    camera.position.lerp(
        cameraTarget,
        cameraSmooth
    )


    // Камера смотрит немного вперёд
    // относительно героя.

    cameraLookTarget.set(
        playerPosition.x,
        1,
        playerPosition.z - 2
    )


    camera.lookAt(
        cameraLookTarget
    )


    // ==================================================
    // Render
    // ==================================================

    renderer.render(
        scene,
        camera
    )
}


// ======================================================
// Start game
// ======================================================

// ВАЖНО:
// animate() вызываем ТОЛЬКО ОДИН РАЗ.

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


        renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio,
                2
            )
        )
    }
)