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

        // limits of this level : the player cannot go through them
        this.limits = null;

        //this.guiManager = new GUIManager(this);

        this.pointer = new PointerManager(this);

        // Build levels
        this.levelManager = new LevelManager(this);

        // Resize window event
        window.addEventListener("resize", function () {
            _this.engine.resize();
        });

        this._initGame();
    }

    _createClass(Game, [{
        key: 'loadAssets',
        value: function loadAssets() {
            var _this2 = this;

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

                _this2.scene.executeWhenReady(function () {

                    _this2.engine.runRenderLoop(function () {
                        _this2.scene.render();
                    });
                });

                // Load first level
                _this2.loadLevel();
            };

            loader.load();
        }
    }, {
        key: 'loadLevel',
        value: function loadLevel() {
            var _this3 = this;

            BABYLON.SceneLoader.ImportMesh('', './assets/levels/', 'level1.babylon', this.scene, function (meshes) {

                _this3.level = _this3.levelManager.buildLevel(meshes);
                _this3.level.init();

                _this3.scene.debugLayer.show();

                _this3.pointer.init();

                _this3.player = new Player(_this3);
                _this3.player.position = _this3.level.startPosition;
            });
        }
    }, {
        key: '_initGame',
        value: function _initGame() {
            var _this4 = this;

            // Create World
            BABYLON.SceneLoader.Load('assets/worlds/', 'world1.babylon', this.engine, function (newscene) {
                _this4.scene = newscene;

                // Load assets
                _this4.loadAssets();
            });
        }

        /**
         * Returns an integer in [min, max[
         */
    }, {
        key: 'createModel',

        /**
         * Create an instance model from the given name.
         */
        value: function createModel(name, parent, autoanim) {
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
                            this.scene.stopAnimation(newmesh);
                        }
                        if (autoanim) {
                            this.scene.beginAnimation(newmesh, 0, 60, true);
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
