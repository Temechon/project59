class PointerManager {

    constructor(game) {
        this.game = game;

        // The object to display when clicking on the ground
        this.decalMaterial = null;
        this.hyphenMaterial = null;

        this.lastPosition = BABYLON.Vector3.Zero();

        // Positions of all hyphens {position, decal}
        this.positions = [];
    }

    drawHyphen(start, end) {

        let dist = BABYLON.Vector3.DistanceSquared(start, end);
        let dir = end.subtract(start);
        dir.normalize();
        dir.scaleInPlace(0.3); // length = 0.4

        let position = start;

        while (dist > 0.1) {
            let pickInfo = this.game.scene.pickWithRay(
                new BABYLON.Ray(
                    new BABYLON.Vector3(position.x, 1000, position.z),  // ray start far on top, otherwise it can not hit.
                    new BABYLON.Vector3(0,-1,0)),
                (mesh) => { return mesh.name == 'ground'});

            if (pickInfo.hit) {
                let decal2 = BABYLON.Mesh.CreateDecal("decal", pickInfo.pickedMesh, pickInfo.pickedPoint, pickInfo.getNormal(true), new BABYLON.Vector3(0.2, 0.2, 0.2));
                decal2.convertToUnIndexedMesh();
                decal2.material = this.hyphenMaterial;
                decal2.lookAt(end, 0, Math.PI/2);
                decal2.freezeWorldMatrix();
                decal2.freezeNormals();
                this.lastPosition = position;

                // save positions
                this.positions.push(
                    {
                        position: pickInfo.pickedPoint,
                        decal : decal2
                    }
                );
            }
            position.addInPlace(dir);
            dist = BABYLON.Vector3.DistanceSquared(position, end);
        }
    }

    // To call when the scene is ready
    init() {

        this.decalMaterial = new BABYLON.StandardMaterial("decalMat", this.game.scene);
        this.decalMaterial.diffuseTexture = new BABYLON.Texture("assets/textures/mouse.png", this.game.scene);
        this.decalMaterial.opacityTexture = this.decalMaterial.diffuseTexture;
        this.decalMaterial.diffuseTexture.hasAlpha = true;
        this.decalMaterial.specularColor = BABYLON.Color3.Black();
        this.decalMaterial.zOffset = -2;
        this.decalMaterial.freeze();

        this.hyphenMaterial = new BABYLON.StandardMaterial("hyphenMat", this.game.scene);
        this.hyphenMaterial.diffuseTexture = new BABYLON.Texture("assets/textures/hyphen.png", this.game.scene);
        this.hyphenMaterial.opacityTexture = this.hyphenMaterial.diffuseTexture;
        this.hyphenMaterial.diffuseTexture.hasAlpha = true;
        this.hyphenMaterial.specularColor = BABYLON.Color3.Black();
        this.hyphenMaterial.zOffset = -5;
        this.hyphenMaterial.freeze();

        let decalSize = new BABYLON.Vector3(1, 1, 1);

        // add action on pointer
        let eventPrefix = BABYLON.Tools.GetPointerPrefix();

        let decal = null;

        this.game.scene.getEngine().getRenderingCanvas().addEventListener(eventPrefix + "down", () => {

            // stop player animations
            this.game.scene.stopAnimation(this.game.player);
            // reset positions of all hyphens
            for (let p of this.positions) {
                p.decal.dispose();
            }
            this.positions = [];

            let pickInfo = this.game.scene.pick(
                this.game.scene.pointerX,
                this.game.scene.pointerY,
                (mesh) => { return mesh.name == 'ground'});
            if (pickInfo.hit) {
                // set last position to player pos
                this.lastPosition = this.game.player.position.clone();

                decal = BABYLON.Mesh.CreateDecal("decal", pickInfo.pickedMesh, pickInfo.pickedPoint, pickInfo.getNormal(true), decalSize);
                decal.material = this.decalMaterial;
            }
        });

        this.game.scene.getEngine().getRenderingCanvas().addEventListener(eventPrefix + "up", () => {
            decal.dispose();
            decal = null;

            this.game.player.whenArrivedAtPoint = (position) => {
                position.decal.dispose();
            };
            this.game.player.move(this.positions);
        });

        this.game.scene.registerBeforeRender(() => {
            if (decal) {

                let pickInfo = this.game.scene.pick(
                    this.game.scene.pointerX,
                    this.game.scene.pointerY,
                    (mesh) => {
                        return mesh.name == 'ground'
                    });

                if (pickInfo.hit) {
                    decal.position = pickInfo.pickedPoint;

                    this.drawHyphen(
                        this.lastPosition,
                        pickInfo.pickedPoint
                    );
                }
            }

        });
    }
}