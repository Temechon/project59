class GameObject extends BABYLON.Mesh {
    constructor(game) {
        super("__go__", game.scene);
        this.game = game;

        // The game object is not visible
        this.isVisible = false;

        // A game object can have several children
        this._children = [];

        // tag
        BABYLON.Tags.AddTagsTo(this, "__go__");
    }

    setReady() {
        this.computeWorldMatrix(true);
        this._children.forEach(function(child) {
            child.computeWorldMatrix(true);
        });
    }

    addChildren(child) {
        child.parent = this;
        this._children.push(child);
    }

    getBoundingRadius() {
        let max = 0;
        for (let c of this._children) {
            let rad = c.getBoundingInfo().boundingSphere.radiusWorld;
            let dist = c.getAbsolutePosition().subtract(this.position).length();
            if (dist+rad>max) {
                max = dist+rad;
            }
        }
        return max;
    }

    isCollidingWith(other) {
        // If other is a gameobject, collide each children
        if (BABYLON.Tags.MatchesQuery(other, "__go__")) {
            for (var i=0; i<this._children.length; i++) {
                for (var j=0; j<other._children.length; j++) {
                    if (this._children[i].intersectsMesh(other._children[j], true)) {
                        return true;
                    }
                }
            }
        } else {
            // Otherwise, collide each children with other
            for (i=0; i<this._children.length; i++) {
                if (this._children[i].intersectsMesh(other, true)) {
                    return true;
                }
            }
        }
    }

    // Override this.material to affect all children instead
    set material(mat) {
        for (let c of this._children) {
            c.material = mat;
        }
    }
}