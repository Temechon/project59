/**
 * Read a level file (babylon file) and retrieve and creates game component according
 * to mesh names
 */
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var LevelManager = (function () {
    function LevelManager(game) {
        _classCallCheck(this, LevelManager);

        this.game = game;
    }

    _createClass(LevelManager, [{
        key: 'buildLevel',
        value: function buildLevel(meshes) {
            var res = new Level(this.game);

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = meshes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var mesh = _step.value;

                    // start position
                    if (mesh.name.indexOf('start') !== -1) {
                        res.startPosition = mesh.position;
                        mesh.dispose();
                    } else {
                        console.log('unused mesh ', mesh);
                    }
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

            return res;
        }
    }]);

    return LevelManager;
})();
//# sourceMappingURL=LevelManager.js.map
