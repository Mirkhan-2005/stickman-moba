import * as THREE from 'three'

export class GameMap {

    public readonly group =
        new THREE.Group()

    public readonly limitX =
        28

    public readonly limitZ =
        18


    constructor() {

        this.createGround()
        this.createGrid()
    }


    private createGround() {

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


        this.group.add(
            ground
        )
    }


    private createGrid() {

        const grid =
            new THREE.GridHelper(
                60,
                30,

                0x25304a,
                0x151923
            )


        grid.position.y =
            0.01


        this.group.add(
            grid
        )
    }


    public clampPosition(
        position: THREE.Vector3
    ) {

        position.x =
            THREE.MathUtils.clamp(
                position.x,
                -this.limitX,
                this.limitX
            )


        position.z =
            THREE.MathUtils.clamp(
                position.z,
                -this.limitZ,
                this.limitZ
            )
    }
}