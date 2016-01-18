/**
 * Read a level file (babylon file) and retrieve and creates game component according
 * to mesh names
 */
class LevelManager {

    constructor(game) {
        this.game = game;

    }


    buildLevel(meshes) {
        let res = new Level(this.game);

        for (let mesh of meshes) {

            // start position
            if (mesh.name.indexOf('start') !== -1) {
                res.startPosition = mesh.position;
                mesh.dispose();
            }
            else {
                console.log('unused mesh ', mesh);
            }
        }

        return res;
    }
}