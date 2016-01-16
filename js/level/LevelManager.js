/**
 * Read a level file (babylon file) and retrieve and creates game component according
 * to mesh names
 */
class LevelManager {

    constructor(game) {
        this.game = game;

    }

    /**
     * Regexp to search for limits of the game
     */
    static LIMIT_REGEXP() {
        return /limit(\d+)/i;
    }


    buildLevel(meshes) {
        let res = new Level(this.game);

        for (let mesh of meshes) {
            // Limit of the field
            var match = LevelManager.LIMIT_REGEXP().exec(mesh.name);
            if (match) {
                // get number
                res.limits[Number(match[1])] = new BABYLON.Vector2(mesh.position.x, mesh.position.z);
                mesh.dispose();
            }

            if (mesh.name.indexOf('limit') !== -1) {

            }
            // start position
            else if (mesh.name.indexOf('start') !== -1) {
                res.startPosition = mesh.position;
                mesh.dispose();
            }
            // collectible
            else if (mesh.name.indexOf('collect') !== -1) {
                res.addCollectible(new Collectible(this.game, mesh.position));
                mesh.dispose();
            }
            else {
                res.decor.push(mesh);
            }
        }

        return res;
    }
}