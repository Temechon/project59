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
        this.assets  = [];

        // The state scene
        this.scene   = null;

        //this.guiManager = new GUIManager(this);

        this.pointer = new PointerManager(this);

        // Resize window event
        window.addEventListener("resize", () => {
            this.engine.resize();
        });

        this.run();

    }
    _initScene() {

        let scene = new BABYLON.Scene(this.engine);
        // Camera attached to the canvas
        let camera = new BABYLON.FreeCamera("cam", new BABYLON.Vector3(0,20,-10), scene);
        camera.setTarget(BABYLON.Vector3.Zero());
        //camera.attachControl(this.engine.getRenderingCanvas());

        // Hemispheric light to light the scene
        let h = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0,1,0), scene);
        h.intensity = 1.0;
        return scene;
    }

    run() {

        this.scene = this._initScene();

        // The loader
        let loader =  new BABYLON.AssetsManager(this.scene);

        //let meshTask = loader.addMeshTask("city", "", "./assets/", "city.babylon");
        //meshTask.onSuccess = (t) => {
        //
        //};

        loader.onFinish = () => {

            // Init the game
            this._initGame();

            this.engine.runRenderLoop(() => {
                this.scene.render();
            });
        };

        loader.load();
    }

    _initGame() {

        // ground creations
        var ground = BABYLON.Mesh.CreateGround("ground", 100, 100, 1, this.scene);
        var mat = new BABYLON.StandardMaterial("", this.scene);
        mat.diffuseTexture = new BABYLON.Texture("assets/textures/grass.jpg", this.scene);
        mat.diffuseTexture.uScale =  mat.diffuseTexture.vScale = 10;
        mat.specularColor = BABYLON.Color3.Black();
        ground.material = mat;
        ground.receiveShadows = true;


        this.scene.debugLayer.show();

        this.pointer.init();

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
}
