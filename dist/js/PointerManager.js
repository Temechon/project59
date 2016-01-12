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

        this.lastPosition = null;

        this.hyphens = [];
    }

    // To call when the scene is ready

    _createClass(PointerManager, [{
        key: "init",
        value: function init() {
            var _this = this;

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
                    _this.lastPosition = decal.position.clone();
                }
            });

            this.game.scene.getEngine().getRenderingCanvas().addEventListener(eventPrefix + "up", function () {
                decal.dispose();
                decal = null;

                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = _this.hyphens[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var h = _step.value;

                        h.dispose();
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

                _this.hyphens = [];
            });

            this.game.scene.registerBeforeRender(function () {
                if (decal) {
                    var pickInfo = _this.game.scene.pick(_this.game.scene.pointerX, _this.game.scene.pointerY);
                    if (pickInfo.hit) {
                        decal.position = pickInfo.pickedPoint;

                        // distance between last positions and this one
                        var dist = BABYLON.Vector3.DistanceSquared(_this.lastPosition, decal.position);
                        if (dist >= 0.25) {
                            var decal2 = BABYLON.Mesh.CreateDecal("decal", pickInfo.pickedMesh, pickInfo.pickedPoint, pickInfo.getNormal(true), new BABYLON.Vector3(0.2, 0.2, 0.2));
                            decal2.material = _this.hyphenMaterial;
                            _this.hyphens.push(decal2);
                            _this.lastPosition = decal2.position.clone();
                        }
                    }
                }
            });
        }
    }]);

    return PointerManager;
})();
//# sourceMappingURL=PointerManager.js.map
