class Player extends GameObject {

    // Call super constructor
    constructor(game) {

        super(game);

        // Set shape
        this.game.createModel('player', this);

        // Player speed
        this.speed = 1.0;

        // the previous player position
        this.lastPosition = this.position.clone();

        this.hollowPosition = this.position.clone();

        // Callback function called when the player arrived at a given point of the path.
        // The position is given as a parameter to this function
        this.whenArrivedAtPoint = null;

    }

    move(positions) {
        // reset animations
        this.animations = [];

        // create animation
        let keys = [];
        let frame = 0;
        let walkAnim = new BABYLON.Animation("moveAnimation", "hollowPosition", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

        for (let p = 0; p<positions.length; p++) {
            let pos = positions[p];
            // Push animation key
            keys.push({
                frame : frame,
                value : pos.position
            });
            // For each point
            walkAnim.addEvent(new BABYLON.AnimationEvent(frame, () => {

                if (p<positions.length-1) {
                    this.lookAt(positions[p+1].position);
                }
                this.whenArrivedAtPoint(pos);
                this._update();
            }));
            frame += 1;
        }
        walkAnim.setKeys(keys);
        this.animations.push(walkAnim);

        let walkAnimatable = this.game.scene.beginAnimation(this, 0, frame);
        walkAnimatable.speedRatio = this.speed;
    }

    _update() {
        //if (pr.hit) {
            // save position
            this.lastPosition.copyFrom(this.position);
            // If the player is within level limits, we go forward
            this.position.copyFrom(this.hollowPosition);

        //} else {
        //    // otherwise, animation is stop
        //    this.getScene().stopAnimation(this);
        //    this.hollowPosition.copyFrom(this.lastPosition);
        //    this.position.copyFrom(this.lastPosition);
        //}

    }
}