"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PointerManager = (function () {
    function PointerManager(game) {
        _classCallCheck(this, PointerManager);

        this.game = game;

        // The object to display when clicking on the ground
        this.decalMaterial = null;
        this.hyphenMaterial = null;

        this.lastPosition = BABYLON.Vector3.Zero();

        // Positions of all hyphens
        this.positions = [];

        // All hyphens
        this.hyphens = [];
    }

    _createClass(PointerManager, [{
        key: "drawHyphen",
        value: function drawHyphen(start, end) {

            var dist = BABYLON.Vector3.DistanceSquared(start, end);
            var dir = end.subtract(start);
            dir.normalize();
            dir.scaleInPlace(0.3); // length = 0.4

            var position = start;

            while (dist > 0.1) {
                var pickInfo = this.game.scene.pickWithRay(new BABYLON.Ray(new BABYLON.Vector3(position.x, 1000, position.z), // ray start far on top, otherwise it can not hit.
                new BABYLON.Vector3(0, -1, 0)), function (mesh) {
                    return mesh.name == 'ground';
                });

                if (pickInfo.hit) {
                    var decal2 = BABYLON.Mesh.CreateDecal("decal", pickInfo.pickedMesh, pickInfo.pickedPoint, pickInfo.getNormal(true), new BABYLON.Vector3(0.2, 0.2, 0.2));
                    decal2.material = this.hyphenMaterial;
                    decal2.lookAt(end, 0, Math.PI / 2);
                    this.lastPosition = position;

                    // save positions
                    this.positions.push(pickInfo.pickedPoint);

                    // save hyphen
                    this.hyphens.push(decal2);
                }
                position.addInPlace(dir);
                dist = BABYLON.Vector3.DistanceSquared(position, end);
            }
        }

        // To call when the scene is ready
    }, {
        key: "init",
        value: function init() {
            var _this = this;

            this.decalMaterial = new BABYLON.StandardMaterial("decalMat", this.game.scene);
            this.decalMaterial.diffuseTexture = new BABYLON.Texture("assets/textures/mouse.png", this.game.scene);
            this.decalMaterial.opacityTexture = this.decalMaterial.diffuseTexture;
            this.decalMaterial.diffuseTexture.hasAlpha = true;
            this.decalMaterial.specularColor = BABYLON.Color3.Black();
            this.decalMaterial.zOffset = -2;

            this.hyphenMaterial = new BABYLON.StandardMaterial("hyphenMat", this.game.scene);
            this.hyphenMaterial.diffuseTexture = new BABYLON.Texture("assets/textures/hyphen.png", this.game.scene);
            this.hyphenMaterial.opacityTexture = this.hyphenMaterial.diffuseTexture;
            this.hyphenMaterial.diffuseTexture.hasAlpha = true;
            this.hyphenMaterial.specularColor = BABYLON.Color3.Black();
            this.hyphenMaterial.zOffset = -5;

            var decalSize = new BABYLON.Vector3(1, 1, 1);

            // add action on pointer
            var eventPrefix = BABYLON.Tools.GetPointerPrefix();

            var decal = null;

            this.game.scene.getEngine().getRenderingCanvas().addEventListener(eventPrefix + "down", function () {
                var pickInfo = _this.game.scene.pick(_this.game.scene.pointerX, _this.game.scene.pointerY, function (mesh) {
                    return mesh.name == 'ground';
                });
                if (pickInfo.hit) {

                    decal = BABYLON.Mesh.CreateDecal("decal", pickInfo.pickedMesh, pickInfo.pickedPoint, pickInfo.getNormal(true), decalSize);
                    decal.material = _this.decalMaterial;
                }
            });

            this.game.scene.getEngine().getRenderingCanvas().addEventListener(eventPrefix + "up", function () {
                decal.dispose();
                decal = null;

                _this.movePlayer();

                //for (let h of this.hyphens) {
                //    h.dispose();
                //}
                //this.hyphens = [];
            });

            this.game.scene.registerBeforeRender(function () {
                if (decal) {

                    var pickInfo = _this.game.scene.pick(_this.game.scene.pointerX, _this.game.scene.pointerY, function (mesh) {
                        return mesh.name == 'ground';
                    });

                    if (pickInfo.hit) {
                        decal.position = pickInfo.pickedPoint;

                        _this.drawHyphen(_this.lastPosition, pickInfo.pickedPoint);
                    }
                }
            });
        }
    }, {
        key: "movePlayer",
        value: function movePlayer() {

            // create animation
            var obj = [];
            var nb = 0;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.positions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var p = _step.value;

                    obj.push({
                        frame: nb,
                        value: p
                    });
                    nb += 1;
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator["return"]) {
                        _iterator["return"]();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            var animationBox = new BABYLON.Animation("tutoAnimation", "position", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
            animationBox.setKeys(obj);
            this.game.player.animations.push(animationBox);
            this.game.scene.beginAnimation(this.game.player, 0, nb);

            //this.game.player.whenStop = () => {
            //    if (this.positions.length > 0) {
            //        this.movePlayer();
            //    }
            //};
            //this.game.player.move(this.positions.shift());
        }
    }]);

    return PointerManager;
})();
//# sourceMappingURL=PointerManager.js.map
