import * as THREE from 'three'

export class MobaCamera {

    public readonly camera:
        THREE.PerspectiveCamera


    private readonly targetPosition =
        new THREE.Vector3()


    private readonly lookPosition =
        new THREE.Vector3()


    constructor() {

        this.camera =
            new THREE.PerspectiveCamera(
                50,

                window.innerWidth /
                window.innerHeight,

                0.1,

                1000
            )


        this.camera.position.set(
            0,
            14,
            16
        )
    }


    public update(
        dt: number,
        target: THREE.Object3D
    ) {

        const position =
            target.position


        // ==========================================
        // Camera position
        // ==========================================

        this.targetPosition.set(
            position.x,
            14,
            position.z + 16
        )


        const cameraSmooth =
            1 -
            Math.exp(
                -5 *
                dt
            )


        this.camera.position.lerp(
            this.targetPosition,
            cameraSmooth
        )


        // ==========================================
        // Camera look target
        // ==========================================

        this.lookPosition.set(
            position.x,
            1,
            position.z - 2
        )


        this.camera.lookAt(
            this.lookPosition
        )
    }


    public resize() {

        this.camera.aspect =
            window.innerWidth /
            window.innerHeight


        this.camera
            .updateProjectionMatrix()
    }
}