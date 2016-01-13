'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Player = (function (_GameObject) {
    _inherits(Player, _GameObject);

    // Call super constructor

    function Player(game) {
        var _this = this;

        _classCallCheck(this, Player);

        _get(Object.getPrototypeOf(Player.prototype), 'constructor', this).call(this, game);

        // Set shape
        this.game.createModel('player', this);

        this.speed = 0.3;
        this._direction = new BABYLON.Vector3(0, 0, 0);
        this._destination = new BABYLON.Vector3(0, 0, 0);
        this._isStopped = true;
        this.canMove = true;

        this.whenStop = null;

        this.getScene().registerBeforeRender(function () {
            _this._update();
        });
    }

    _createClass(Player, [{
        key: 'move',
        value: function move(point) {
            if (this.canMove) {
                // Look the destination
                this.lookAt(point);

                this._destination = point;
                this._direction = this._destination.subtract(this.position);
                this._direction.y = 0;
                this._direction.normalize();
                this._direction.scaleInPlace(this.speed);
                this._isStopped = false;
            }
        }
    }, {
        key: '_update',
        value: function _update() {
            if (BABYLON.Vector3.DistanceSquared(this.position, this._destination) > 1) {
                this.position.addInPlace(this._direction);
            } else if (!this._isStopped) {
                this._isStopped = true;
                if (this.whenStop) {
                    this.whenStop();
                }
            }
        }
    }]);

    return Player;
})(GameObject);
//# sourceMappingURL=Player.js.map
