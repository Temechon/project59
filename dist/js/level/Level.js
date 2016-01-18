"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Level = (function () {
    function Level(game) {
        _classCallCheck(this, Level);

        this.game = game;

        // Player starting position
        this.startPosition = null;
    }

    _createClass(Level, [{
        key: "init",
        value: function init() {}

        // Dispose the whole level, which cannot be reseted afterwards.
    }, {
        key: "dispose",
        value: function dispose() {}

        // Reset the level
    }, {
        key: "reset",
        value: function reset() {}
    }]);

    return Level;
})();
//# sourceMappingURL=Level.js.map
