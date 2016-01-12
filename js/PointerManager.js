class PointerManager {

    constructor(game) {
        this.game = game;

        // The object to display when clicking on the ground
        this.decalMaterial = null;
        this.hyphenMaterial = null;

        this.lastPosition = null;

        this.hyphens = [];


    }

    // To call when the scene is ready
    init() {

        this.decalMaterial = new BABYLON.StandardMaterial("decalMat", this.game.scene);
        this.decalMaterial.diffuseTexture = new BABYLON.Texture("assets/textures/mouse.png", this.game.scene);
        this.decalMaterial.diffuseTexture.hasAlpha = true;
        this.decalMaterial.specularColor = BABYLON.Color3.Black();
        this.decalMaterial.zOffset = -2;

        this.hyphenMaterial = new BABYLON.StandardMaterial("hyphenMat", this.game.scene);
        this.hyphenMaterial.diffuseTexture = new BABYLON.Texture("assets/textures/hyphen.png", this.game.scene);
        this.hyphenMaterial.diffuseTexture.hasAlpha = true;
        this.hyphenMaterial.specularColor = BABYLON.Color3.Black();
        this.hyphenMaterial.zOffset = -5;

        let decalSize = new BABYLON.Vector3(1, 1, 1);

        // add action on pointer
        let eventPrefix = BABYLON.Tools.GetPointerPrefix();

        let decal = null;

        this.game.scene.getEngine().getRenderingCanvas().addEventListener(eventPrefix + "down", () => {
            let pickInfo = this.game.scene.pick(
                this.game.scene.pointerX,
                this.game.scene.pointerY,
                (mesh) => { return mesh.name == 'ground'});
            if (pickInfo.hit) {

                decal = BABYLON.Mesh.CreateDecal("decal", pickInfo.pickedMesh, pickInfo.pickedPoint, pickInfo.getNormal(true), decalSize);
                decal.material = this.decalMaterial;
                this.lastPosition = decal.position.clone();
            }
        });

        this.game.scene.getEngine().getRenderingCanvas().addEventListener(eventPrefix + "up", () => {
            decal.dispose();
            decal = null;

            for (let h of this.hyphens) {
                h.dispose();
            }
            this.hyphens = [];
        });

        this.game.scene.registerBeforeRender(() => {
            if (decal) {
                let pickInfo = this.game.scene.pick(this.game.scene.pointerX, this.game.scene.pointerY);
                if (pickInfo.hit) {
                    decal.position = pickInfo.pickedPoint;

                    // distance between last positions and this one
                    let dist = BABYLON.Vector3.DistanceSquared(this.lastPosition, decal.position);
                    if (dist >= 0.25) {
                        let decal2 = BABYLON.Mesh.CreateDecal("decal", pickInfo.pickedMesh, pickInfo.pickedPoint, pickInfo.getNormal(true), new BABYLON.Vector3(0.2,0.2,0.2));
                        decal2.material = this.hyphenMaterial;
                        this.hyphens.push(decal2);
                        this.lastPosition = decal2.position.clone();
                    }

                }
            }
        });
    }



}