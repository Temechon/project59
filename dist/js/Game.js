'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

window.addEventListener("DOMContentLoaded", function () {

    setTimeout(function () {
        document.getElementById('splashscreen').classList.add('hide');
    }, 150);

    new Game('game-canvas');
});

var Game = (function () {
    function Game(canvasId) {
        var _this = this;

        _classCallCheck(this, Game);

        var canvas = document.getElementById(canvasId);
        this.engine = new BABYLON.Engine(canvas, true);

        // Contains all loaded assets needed for this state
        this.assets = [];

        // The state scene
        this.scene = null;

        //this.guiManager = new GUIManager(this);

        this.pointer = new PointerManager(this);

        // Resize window event
        window.addEventListener("resize", function () {
            _this.engine.resize();
        });

        this.run();
    }

    _createClass(Game, [{
        key: '_initScene',
        value: function _initScene() {

            var scene = new BABYLON.Scene(this.engine);
            // Camera attached to the canvas
            var camera = new BABYLON.FreeCamera("cam", new BABYLON.Vector3(0, 20, -10), scene);
            camera.setTarget(BABYLON.Vector3.Zero());
            //camera.attachControl(this.engine.getRenderingCanvas());

            // Hemispheric light to light the scene
            var h = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);
            h.intensity = 1.0;
            return scene;
        }
    }, {
        key: 'run',
        value: function run() {
            var _this2 = this;

            this.scene = this._initScene();

            // The loader
            var loader = new BABYLON.AssetsManager(this.scene);

            var meshTask = loader.addMeshTask("player", "", "./assets/player/", "player.babylon");
            meshTask.onSuccess = function (t) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = t.loadedMeshes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var m = _step.value;

                        m.setEnabled(false);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator['return']) {
                            _iterator['return']();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                _this2.assets['player'] = {
                    meshes: t.loadedMeshes
                };
            };

            loader.onFinish = function () {

                // Init the game
                _this2._initGame();

                _this2.engine.runRenderLoop(function () {
                    _this2.scene.render();
                });
            };

            loader.load();
        }
    }, {
        key: '_initGame',
        value: function _initGame() {

            // ground creations
            var ground = BABYLON.Mesh.CreateGround("ground", 100, 100, 1, this.scene);
            var mat = new BABYLON.StandardMaterial("", this.scene);
            mat.diffuseTexture = new BABYLON.Texture("assets/textures/grass.jpg", this.scene);
            mat.diffuseTexture.uScale = mat.diffuseTexture.vScale = 10;
            mat.specularColor = BABYLON.Color3.Black();
            ground.material = mat;
            ground.receiveShadows = true;

            this.scene.debugLayer.show();

            this.pointer.init();

            this.player = new Player(this);
        }

        /**
         * Returns an integer in [min, max[
         */
    }, {
        key: 'createModel',

        /**
         * Create an instance model from the given name.
         * @param obj {meshes, animations}
         * @param parent The parent gameobject
         */
        value: function createModel(name, parent) {
            if (!this.assets[name]) {
                console.warn('No asset corresponding.');
            } else {

                var obj = this.assets[name];
                //parent._animations = obj.animations;
                var meshes = obj.meshes;

                for (var i = 0; i < meshes.length; i++) {
                    // Don't clone mesh without any vertices
                    if (meshes[i].getTotalVertices() > 0) {

                        var newmesh = meshes[i].clone(meshes[i].name, null, true);
                        parent.addChildren(newmesh);

                        newmesh.setEnabled(true);
                        if (meshes[i].skeleton) {
                            newmesh.skeleton = meshes[i].skeleton.clone();
                            //this.scene.beginAnimation(newmesh, 0, 500, true);
                            this.scene.stopAnimation(newmesh);
                        }
                    }
                }
            }
        }
    }], [{
        key: 'randomNumber',
        value: function randomNumber(min, max) {
            if (min === max) {
                return min;
            }
            var random = Math.random();
            return Math.floor(random * (max - min) + min);
        }
    }]);

    return Game;
})();
//# sourceMappingURL=Game.js.map
