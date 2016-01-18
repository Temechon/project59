/**
 * Represents something that can be picked by the player.
 * If the player intersects with it, its corresponding action is called.
 *
 * When created, it check at each frame if the player intersects it.
 */
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Collectible = (function (_GameObject) {
    _inherits(Collectible, _GameObject);

    function Collectible(game, position) {
        _classCallCheck(this, Collectible);

        _get(Object.getPrototypeOf(Collectible.prototype), 'constructor', this).call(this, game);

        this.position.copyFrom(position);

        // Create collectivle model
        this.game.createModel('badge', this, true);

        // Check each frame for intersection with player
        this.check = this._check.bind(this);

        // Register the check
        this.getScene().registerBeforeRender(this.check);

        this.setReady();
    }

    /**
     * Check if this collectible intersects with the player
     * @private
     */

    _createClass(Collectible, [{
        key: '_check',
        value: function _check() {
            if (this.game.player) {
                if (this.isCollidingWith(this.game.player)) {
                    this.action();
                }
            }
        }
    }, {
        key: 'action',
        value: function action() {
            // to be overloaded in subclasses
            this.dispose();
        }
    }, {
        key: 'dispose',
        value: function dispose() {
            // Remove check
            this.getScene().unregisterBeforeRender(this.check);
            _get(Object.getPrototypeOf(Collectible.prototype), 'dispose', this).call(this);
        }
    }]);

    return Collectible;
})(GameObject);
//# sourceMappingURL=Collectible.js.map
