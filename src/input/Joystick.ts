import * as THREE from 'three'

export class Joystick {

    public direction =
        new THREE.Vector2()

    private container:
        HTMLDivElement

    private stick:
        HTMLDivElement

    private active =
        false

    private maxDistance =
        50


    constructor() {

        // ==========================
        // OUTER JOYSTICK
        // ==========================

        this.container =
            document.createElement('div')


        this.container.id =
            'joystick'


        document.body.appendChild(
            this.container
        )


        // ==========================
        // INNER STICK
        // ==========================

        this.stick =
            document.createElement('div')


        this.stick.id =
            'joystick-stick'


        this.container.appendChild(
            this.stick
        )


        // ==========================
        // Mouse
        // ==========================

        this.container.addEventListener(
            'mousedown',
            this.start
        )


        window.addEventListener(
            'mousemove',
            this.move
        )


        window.addEventListener(
            'mouseup',
            this.end
        )


        // ==========================
        // Touch
        // ==========================

        this.container.addEventListener(
            'touchstart',
            this.startTouch,
            {
                passive: false
            }
        )


        window.addEventListener(
            'touchmove',
            this.moveTouch,
            {
                passive: false
            }
        )


        window.addEventListener(
            'touchend',
            this.end
        )
    }


    // ==============================
    // START MOUSE
    // ==============================

    private start =
        (
            event:
                MouseEvent
        ) => {

            this.active =
                true


            this.update(
                event.clientX,
                event.clientY
            )
        }


    // ==============================
    // MOVE MOUSE
    // ==============================

    private move =
        (
            event:
                MouseEvent
        ) => {

            if (
                !this.active
            ) {
                return
            }


            this.update(
                event.clientX,
                event.clientY
            )
        }


    // ==============================
    // START TOUCH
    // ==============================

    private startTouch =
        (
            event:
                TouchEvent
        ) => {

            event.preventDefault()


            this.active =
                true


            const touch =
                event.touches[0]


            this.update(
                touch.clientX,
                touch.clientY
            )
        }


    // ==============================
    // MOVE TOUCH
    // ==============================

    private moveTouch =
        (
            event:
                TouchEvent
        ) => {

            if (
                !this.active
            ) {
                return
            }


            event.preventDefault()


            const touch =
                event.touches[0]


            this.update(
                touch.clientX,
                touch.clientY
            )
        }


    // ==============================
    // STOP
    // ==============================

    private end =
        () => {

            this.active =
                false


            this.direction.set(
                0,
                0
            )


            this.stick.style.transform =
                `translate(0px, 0px)`
        }


    // ==============================
    // CALCULATE JOYSTICK
    // ==============================

    private update(
        clientX: number,
        clientY: number
    ) {

        const rect =
            this.container
                .getBoundingClientRect()


        const centerX =
            rect.left +
            rect.width / 2


        const centerY =
            rect.top +
            rect.height / 2


        let dx =
            clientX -
            centerX


        let dy =
            clientY -
            centerY


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            )


        if (
            distance >
            this.maxDistance
        ) {

            dx =
                dx /
                distance *
                this.maxDistance


            dy =
                dy /
                distance *
                this.maxDistance
        }


        // ==========================
        // MOVE VISUAL STICK
        // ==========================

        this.stick.style.transform =
            `translate(${dx}px, ${dy}px)`


        // ==========================
        // NORMALIZED DIRECTION
        // ==========================

        this.direction.set(

            dx /
            this.maxDistance,

            dy /
            this.maxDistance
        )
    }
}