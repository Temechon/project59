class Player extends GameObject {

    // Call super constructor
    constructor(game) {

        super(game);

        this.hollowPosition = BABYLON.Vector3.Zero();

        // Set shape
        this.game.createModel('player', this);

        // Player speed
        this.speed = 1.0;

        // Callback function called when the player arrived at a given point of the path.
        // The position is given as a parameter to this function
        this.whenArrivedAtPoint = null;

        this.getScene().registerBeforeRender(() => {
            this._update();
        });

        this.ellipsoid = new BABYLON.Vector3(2,2,2);
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
                let diff = this.position.subtract(this.hollowPosition);
                diff.scaleInPlace(-1);
                this.moveWithCollisions(diff);
                this.whenArrivedAtPoint(pos);
            }));
            frame += 1;
        }
        walkAnim.setKeys(keys);
        this.animations.push(walkAnim);

        let walkAnimatable = this.game.scene.beginAnimation(this, 0, frame);
        walkAnimatable.speedRatio = this.speed;
    }

    _update() {


    }
}