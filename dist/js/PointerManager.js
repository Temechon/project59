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

        // Positions of all hyphens {position, decal}
        this.positions = [];
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
                    decal2.convertToUnIndexedMesh();
                    decal2.material = this.hyphenMaterial;
                    decal2.lookAt(end, 0, Math.PI / 2);
                    decal2.freezeWorldMatrix();
                    decal2.freezeNormals();
                    this.lastPosition = position;

                    // save positions
                    this.positions.push({
                        position: pickInfo.pickedPoint,
                        decal: decal2
                    });
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
            this.decalMaterial.freeze();

            this.hyphenMaterial = new BABYLON.StandardMaterial("hyphenMat", this.game.scene);
            this.hyphenMaterial.diffuseTexture = new BABYLON.Texture("assets/textures/hyphen.png", this.game.scene);
            this.hyphenMaterial.opacityTexture = this.hyphenMaterial.diffuseTexture;
            this.hyphenMaterial.diffuseTexture.hasAlpha = true;
            this.hyphenMaterial.specularColor = BABYLON.Color3.Black();
            this.hyphenMaterial.zOffset = -5;
            this.hyphenMaterial.freeze();

            var decalSize = new BABYLON.Vector3(1, 1, 1);

            // add action on pointer
            var eventPrefix = BABYLON.Tools.GetPointerPrefix();

            var decal = null;

            this.game.scene.getEngine().getRenderingCanvas().addEventListener(eventPrefix + "down", function () {

                // stop player animations
                _this.game.scene.stopAnimation(_this.game.player);
                // reset positions of all hyphens
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = _this.positions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var p = _step.value;

                        p.decal.dispose();
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

                _this.positions = [];

                var pickInfo = _this.game.scene.pick(_this.game.scene.pointerX, _this.game.scene.pointerY, function (mesh) {
                    return mesh.name == 'ground';
                });
                if (pickInfo.hit) {
                    // set last position to player pos
                    _this.lastPosition = _this.game.player.position.clone();

                    decal = BABYLON.Mesh.CreateDecal("decal", pickInfo.pickedMesh, pickInfo.pickedPoint, pickInfo.getNormal(true), decalSize);
                    decal.material = _this.decalMaterial;
                }
            });

            this.game.scene.getEngine().getRenderingCanvas().addEventListener(eventPrefix + "up", function () {
                decal.dispose();
                decal = null;

                _this.game.player.whenArrivedAtPoint = function (position) {
                    position.decal.dispose();
                };
                _this.game.player.move(_this.positions);
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
    }]);

    return PointerManager;
})();
//# sourceMappingURL=PointerManager.js.map
