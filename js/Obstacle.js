class Obstacle extends GameObject{

    constructor(game) {
        super(game);

        // Set shape
        this.game.createModel('player', this);

        this._children.forEach((c) => {
            c.checkCollisions = true;
        })

    }
}