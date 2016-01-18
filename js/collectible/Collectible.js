/**
 * Represents something that can be picked by the player.
 * If the player intersects with it, its corresponding action is called.
 *
 * When created, it check at each frame if the player intersects it.
 */
class Collectible extends GameObject {

    constructor(game, position) {
        super(game);

        this.position.copyFrom(position);

        // Create collectivle model
        this.game.createModel('badge', this, true);

        // Check each frame for intersection with player
        this.check = this._check.bind(this);

        // Register the check
        this.getScene().registerBeforeRender(this.check);

        this.setReady();
    }

    /**
     * Check if this collectible intersects with the player
     * @private
     */
    _check() {
        if (this.game.player) {
            if (this.isCollidingWith(this.game.player)) {
                this.action();
            }
        }
    }

    action() {
        // to be overloaded in subclasses
        this.dispose();
    }

    dispose() {
        // Remove check
        this.getScene().unregisterBeforeRender(this.check);
        super.dispose();
    }




}