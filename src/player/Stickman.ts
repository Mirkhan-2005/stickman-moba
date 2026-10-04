import * as THREE from 'three'

export class Stickman {

    public group = new THREE.Group()

    private visual = new THREE.Group()

    private leftArm = new THREE.Group()
    private rightArm = new THREE.Group()

    private leftLeg = new THREE.Group()
    private rightLeg = new THREE.Group()

    private head: THREE.Mesh

    private walkTime = 0


    private attackTime = 0

    private readonly attackDuration = 0.3

    private bodyMaterial: THREE.MeshStandardMaterial


    constructor(
        color: number = 0x17bfff
    ) {

        this.bodyMaterial =
            new THREE.MeshStandardMaterial({
                color: color,
                emissive: color,
                emissiveIntensity: 0.35,
                roughness: 0.4
            })


        this.group.add(
            this.visual
        )


        // ==========================================
        // BODY
        // ==========================================

        const body =
            new THREE.Mesh(
                new THREE.CapsuleGeometry(
                    0.22,
                    0.75,
                    8,
                    16
                ),
                this.bodyMaterial
            )


        body.position.y = 1.55

        body.castShadow = true

        this.visual.add(
            body
        )


        // ==========================================
        // HEAD
        // ==========================================

        this.head =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    0.42,
                    24,
                    16
                ),
                this.bodyMaterial
            )


        this.head.position.y = 2.55

        this.head.castShadow = true

        this.visual.add(
            this.head
        )


        // ==========================================
        // EYES
        // ==========================================

        const eyeMaterial =
            new THREE.MeshStandardMaterial({
                color: 0xffffff,

                emissive: 0xffffff,

                emissiveIntensity: 2
            })


        const leftEye =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    0.07,
                    12,
                    8
                ),
                eyeMaterial
            )


        leftEye.scale.set(
            1.4,
            0.6,
            0.4
        )


        leftEye.position.set(
            -0.14,
            2.58,
            0.39
        )


        this.visual.add(
            leftEye
        )


        const rightEye =
            leftEye.clone()


        rightEye.position.x =
            0.14


        this.visual.add(
            rightEye
        )


        // ==========================================
        // BACK MARK
        // ==========================================

        const backMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x050505
            })


        const backMark =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.25,
                    0.4,
                    0.05
                ),
                backMaterial
            )


        backMark.position.set(
            0,
            1.6,
            -0.24
        )


        this.visual.add(
            backMark
        )


        // ==========================================
        // ARMS
        // ==========================================

        this.createArm(
            this.leftArm,
            -0.31
        )


        this.createArm(
            this.rightArm,
            0.31
        )


        // ==========================================
        // LEGS
        // ==========================================

        this.createLeg(
            this.leftLeg,
            -0.14
        )


        this.createLeg(
            this.rightLeg,
            0.14
        )


        // ==========================================
        // PLAYER RING
        // ==========================================

        const ring =
            new THREE.Mesh(
                new THREE.RingGeometry(
                    0.6,
                    0.68,
                    48
                ),

                new THREE.MeshBasicMaterial({
                    color: color,

                    transparent: true,

                    opacity: 0.5,

                    side:
                        THREE.DoubleSide
                })
            )


        ring.rotation.x =
            -Math.PI / 2


        ring.position.y =
            0.03


        this.group.add(
            ring
        )
    }


    // ==============================================
    // ARM
    // ==============================================

    private createArm(
        arm: THREE.Group,
        x: number
    ) {

        arm.position.set(
            x,
            1.95,
            0
        )


        const geometry =
            new THREE.CapsuleGeometry(
                0.1,
                0.7,
                6,
                12
            )


        const mesh =
            new THREE.Mesh(
                geometry,
                this.bodyMaterial
            )


        mesh.position.y =
            -0.45


        mesh.castShadow =
            true


        arm.add(
            mesh
        )


        this.visual.add(
            arm
        )
    }


    // ==============================================
    // LEG
    // ==============================================

    private createLeg(
        leg: THREE.Group,
        x: number
    ) {

        leg.position.set(
            x,
            1.05,
            0
        )


        const geometry =
            new THREE.CapsuleGeometry(
                0.12,
                0.85,
                6,
                12
            )


        const mesh =
            new THREE.Mesh(
                geometry,
                this.bodyMaterial
            )


        mesh.position.y =
            -0.55


        mesh.castShadow =
            true


        leg.add(
            mesh
        )


        this.visual.add(
            leg
        )
    }


    // ==============================================
    // UPDATE ANIMATION
    // ==============================================

    public playAttack() {

        this.attackTime =
            this.attackDuration
}

    public update(
        dt: number,
        speed: number
    ) {

        if (
    this.attackTime >
    0
) {

    this.attackTime -=
        dt


    const progress =
        1 -
        Math.max(
            this.attackTime,
            0
        ) /
        this.attackDuration


    const swing =
        Math.sin(
            progress *
            Math.PI
        )


    // Правая рука резко бьёт вперёд
    this.rightArm.rotation.x =
        -1.8 *
        swing


    // Левая немного уходит назад
    this.leftArm.rotation.x =
        0.35 *
        swing


    // Небольшой наклон корпуса
    this.visual.rotation.x =
        -0.18 *
        swing


    this.visual.position.y =
        0


    return
}



        const moving =
            speed > 0.05


        if (moving) {

            this.walkTime +=
                dt * 10


            const walk =
                Math.sin(
                    this.walkTime
                )


            // Legs
            this.leftLeg.rotation.x =
                walk * 0.7


            this.rightLeg.rotation.x =
                -walk * 0.7


            // Arms
            this.leftArm.rotation.x =
                -walk * 0.5


            this.rightArm.rotation.x =
                walk * 0.5


            // Body bounce
            this.visual.position.y =
                Math.abs(
                    Math.sin(
                        this.walkTime * 2
                    )
                ) * 0.04


            // Slight forward lean
            this.visual.rotation.x =
                -0.1

        } else {

            // возвращаемся в idle

            this.leftLeg.rotation.x *=
                0.85


            this.rightLeg.rotation.x *=
                0.85


            this.leftArm.rotation.x *=
                0.85


            this.rightArm.rotation.x *=
                0.85


            this.visual.rotation.x *=
                0.85


            // лёгкое дыхание

            this.visual.position.y =
                Math.sin(
                    performance.now() *
                    0.002
                ) * 0.015
        }
    }
}