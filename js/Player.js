class Player extends GameObject {

    // Call super constructor
    constructor(game) {

        super(game);

        // Set shape
        this.game.createModel('player', this);

        this.speed = 0.3;
        this._direction = new BABYLON.Vector3(0, 0, 0);
        this._destination = new BABYLON.Vector3(0, 0, 0);
        this._isStopped = true;
        this.canMove = true;

        this.whenStop = null;

        this.getScene().registerBeforeRender(() => {
            this._update();
        });
    }

    move(point) {
        if (this.canMove) {
            // Look the destination
            this.lookAt(point);

            this._destination = point;
            this._direction = this._destination.subtract(this.position);
            this._direction.y = 0;
            this._direction.normalize();
            this._direction.scaleInPlace(this.speed);
            this._isStopped = false;
        }
    }

    _update() {
        if (BABYLON.Vector3.DistanceSquared(this.position, this._destination) > 1) {
            this.position.addInPlace(this._direction);
        } else if (!this._isStopped) {
            this._isStopped = true;
            if (this.whenStop) {
                this.whenStop();
            }
        }
    }
}