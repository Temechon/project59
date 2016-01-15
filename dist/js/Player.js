"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Player = (function (_GameObject) {
    _inherits(Player, _GameObject);

    // Call super constructor

    function Player(game) {
        var _this = this;

        _classCallCheck(this, Player);

        _get(Object.getPrototypeOf(Player.prototype), "constructor", this).call(this, game);

        // Set shape
        this.game.createModel('player', this);

        // Player speed
        this.speed = 1.0;

        // the previous player position
        this.lastPosition = this.position.clone();

        this.hollowPosition = this.position.clone();

        // Callback function called when the player arrived at a given point of the path.
        // The position is given as a parameter to this function
        this.whenArrivedAtPoint = null;

        this.getScene().registerBeforeRender(function () {

            var ray = new BABYLON.Ray(_this.position, new BABYLON.Vector3(0, 1, 0));
            var limits = _this.game.limits;
            var pr = _this.getScene().pickWithRay(ray, function (mesh) {
                return mesh.name === limits.name;
            });

            if (pr.hit) {
                limits.material.diffuseColor = BABYLON.Color3.Green();
            } else {
                limits.material.diffuseColor = BABYLON.Color3.Red();
            }
        });
    }

    _createClass(Player, [{
        key: "move",
        value: function move(positions) {
            var _this2 = this;

            // reset animations
            this.animations = [];

            // create animation
            var keys = [];
            var frame = 0;
            var walkAnim = new BABYLON.Animation("moveAnimation", "hollowPosition", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

            var _loop = function (p) {
                var pos = positions[p];
                // Push animation key
                keys.push({
                    frame: frame,
                    value: pos.position
                });
                // For each point
                walkAnim.addEvent(new BABYLON.AnimationEvent(frame, function () {

                    if (p < positions.length - 1) {
                        _this2.lookAt(positions[p + 1].position);
                    }
                    _this2.whenArrivedAtPoint(pos);
                    _this2._update();
                }));
                frame += 1;
            };

            for (var p = 0; p < positions.length; p++) {
                _loop(p);
            }
            walkAnim.setKeys(keys);
            this.animations.push(walkAnim);

            var walkAnimatable = this.game.scene.beginAnimation(this, 0, frame);
            walkAnimatable.speedRatio = this.speed;
        }
    }, {
        key: "_update",
        value: function _update() {
            var ray = new BABYLON.Ray(this.hollowPosition, new BABYLON.Vector3(0, 1, 0));
            var limits = this.game.limits;
            var pr = this.getScene().pickWithRay(ray, function (mesh) {
                return mesh.name === limits.name;
            });

            if (pr.hit) {
                // save position
                this.lastPosition.copyFrom(this.position);
                // If the player is within level limits, we go forward
                this.position.copyFrom(this.hollowPosition);
            } else {
                // otherwise, animation is stop
                //this.getScene().stopAnimation(this);
                //this.hollowPosition.copyFrom(this.lastPosition);
                //this.position.copyFrom(this.lastPosition);
            }
        }
    }]);

    return Player;
})(GameObject);
//# sourceMappingURL=Player.js.map
