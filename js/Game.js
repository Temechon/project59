window.addEventListener("DOMContentLoaded", () => {

    setTimeout(() => {
        document.getElementById('splashscreen').classList.add('hide');
    }, 150);

    new Game('game-canvas');
});


class Game {
    constructor(canvasId) {

        let canvas          = document.getElementById(canvasId);
        this.engine         = new BABYLON.Engine(canvas, true);

        // Contains all loaded assets needed for this state
        this.assets         = [];

        // The state scene
        this.scene          = null;

        // limits of this level : the player cannot go through them
        this.limits         = null;

        //this.guiManager = new GUIManager(this);

        this.pointer        = new PointerManager(this);

        // Build levels
        this.levelManager   = new LevelManager(this);

        // Resize window event
        window.addEventListener("resize", () => {
            this.engine.resize();
        });

        this._initGame();

    }

    loadAssets() {

        // The loader
        let loader =  new BABYLON.AssetsManager(this.scene);

        let meshTask = loader.addMeshTask("player", "", "./assets/player/", "player.babylon");
        meshTask.onSuccess = (t) => {
            for (let m of t.loadedMeshes) {
                m.setEnabled (false);
            }
            this.assets['player'] = {
                meshes : t.loadedMeshes
            }
        };

        loader.onFinish = () => {

            this.scene.executeWhenReady(() => {

                this.engine.runRenderLoop(() => {
                    this.scene.render();
                });
            })

            // Load first level
            this.loadLevel();

        };

        loader.load();
    }

    loadLevel() {
        BABYLON.SceneLoader.ImportMesh('', './assets/levels/', 'level1.babylon', this.scene, (meshes) => {

            this.level = this.levelManager.buildLevel(meshes);
            this.level.init();


            this.scene.debugLayer.show();

            this.pointer.init();

            this.player = new Player(this);
            this.player.position = this.level.startPosition;
        });
    }

    _initGame() {

        // Create World
        BABYLON.SceneLoader.Load('assets/worlds/', 'world1.babylon', this.engine, (newscene) => {
            this.scene = newscene;

            // Load assets
            this.loadAssets();
        });


    }

    /**
     * Returns an integer in [min, max[
     */
    static randomNumber(min, max) {
        if (min === max) {
            return (min);
        }
        let random = Math.random();
        return Math.floor(((random * (max - min)) + min));
    }

    /**
     * Create an instance model from the given name.
     */
    createModel(name, parent, autoanim) {
        if (! this.assets[name]) {
            console.warn('No asset corresponding.');
        } else {

            let obj = this.assets[name];
            //parent._animations = obj.animations;
            let meshes = obj.meshes;

            for (let i=0; i<meshes.length; i++ ){
                // Don't clone mesh without any vertices
                if (meshes[i].getTotalVertices() > 0) {

                    let newmesh = meshes[i].clone(meshes[i].name, null, true);
                    parent.addChildren(newmesh);

                    newmesh.setEnabled(true);
                    if (meshes[i].skeleton) {
                        newmesh.skeleton = meshes[i].skeleton.clone();
                        this.scene.stopAnimation(newmesh);
                    }
                    if (autoanim) {
                        this.scene.beginAnimation(newmesh, 0, 60, true);
                    }
                }
            }
        }
    }
}
