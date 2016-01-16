class Level {

    constructor(game) {
        this.game = game;

        // Contains positions of limits
        this.limits = [];
        // The limit polygon
        this.limitPoly = null;

        this.collectibles = [];

        // Player starting position
        this.startPosition = null;

        // Useful in case of reset. Contains only positions of collectibles
        this.startingCollectibles = [];

        // all mesh composing the level
        this.decor = [];
    }

    init() {

        this.limitPoly = new BABYLON.PolygonMeshBuilder("limits", this.limits, this.game.scene).build();
        this.limitPoly.material = new BABYLON.StandardMaterial('', this.game.scene);
        this.limitPoly.material.alpha = 0.25;
        this.limitPoly.material.specularColor = BABYLON.Color3.Black();
        this.limitPoly.position.y = 2;
    }

    // Dispose the whole level, which cannot be reseted afterwards.
    dispose() {
        // dispose limits
        this.limitPoly.dispose();
        // dispose collectibles
        for (let c of this.collectibles) {
            c.dispose();
        }
        // dispose decor
        for (let d of this.decor) {
            d.dispose();
        }
    }

    // Reset the level
    reset() {
        for (let c of this.collectibles) {
            c.dispose();
        }

        for (let c of this.startingCollectibles) {
            this.collectibles.push(new Collectible(this.game, c));
        }
    }

    addCollectible(c) {
        this.collectibles.push(c);
        this.startingCollectibles.push(c.position.clone());
    }


}