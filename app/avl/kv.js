"use strict";
exports.__esModule = true;
var AvlNode = (function () {
    function AvlNode(key, value, left, right) {
        if (left === void 0) { left = null; }
        if (right === void 0) { right = null; }
        this.key = key;
        this.value = value;
        this.left = left;
        this.right = right;
        this.height = 0;
    }
    /**
     * Performs a right rotate on this node.
     *
     *       b                           a
     *      / \                         / \
     *     a   e -> b.rotateRight() -> c   b
     *    / \                             / \
     *   c   d                           d   e
     *
     * @return { Node } The root of the sub-tree; the node where this node used to be.
     */
    AvlNode.prototype.rotateRight = function () {
        var prevL = this.left;
        this.left = prevL.right;
        prevL.right = this;
        var left = this.left;
        var right = this.right;
        var leftHeight = left ? left.height : -1;
        var rightHeight = right ? right.height : -1;
        this.height = Math.max(leftHeight, rightHeight) + 1;
        prevL.height = Math.max(leftHeight, this.height) + 1;
        return prevL;
    };
    ;
    /**
     * Performs a left rotate on this node.
     *
     *     a                              b
     *    / \                            / \
     *   c   b   -> a.rotateLeft() ->   a   e
     *      / \                        / \
     *     d   e                      c   d
     *
     * @return { Node } The root of the sub-tree; the node where this node used to be.
     */
    AvlNode.prototype.rotateLeft = function () {
        var prevRight = this.right;
        this.right = prevRight.left;
        prevRight.left = this;
        var left = this.left;
        var right = this.right;
        var leftHeight = left ? left.height : -1;
        var rightHeight = right ? right.height : -1;
        this.height = Math.max(leftHeight, rightHeight) + 1;
        prevRight.height = Math.max(rightHeight, this.height) + 1;
        return prevRight;
    };
    ;
    return AvlNode;
}());
exports.AvlNode = AvlNode;
var Avl = (function () {
    /**
     * Creates a new AVL Tree.
     *
     * @param {function} _compare An optional custom compare function.
     */
    function Avl(_compare) {
        this._compare = _compare;
        this._size = 0;
        this._root = null;
    }
    Object.defineProperty(Avl.prototype, "size", {
        /**
         * @return { number } The size of the tree.
         */
        get: function () {
            return this._size;
        },
        enumerable: true,
        configurable: true
    });
    ;
    /**
     * @return { boolean } Whether the tree is empty.
     */
    Avl.prototype.isEmpty = function () {
        return this._size === 0;
    };
    ;
    /**
     * Inserts a new node with a specific key into the tree, when key already exists in the tree it gets replaced.
     *
     * @private
     * @param { Object } key The key being inserted.
     * @param { Object } value The value being inserted.
     * @return { Node } The new tree root.
     */
    Avl.prototype.add = function (key, value) {
        this._size++;
        this._root = this._add(key, value, this._root);
        return value;
    };
    /**
     * Lazily inserts a new node with a specific key into the tree.
     *
     * @private
     * @param { Object } key The key being inserted.
     * @param { Node } root The root of the tree to insert in.
     * @param { Object } value The value being inserted.
     * @return { Node } The new tree root.
     */
    Avl.prototype._add = function (key, value, root) {
        // Perform regular BST insertion
        if (root === null) {
            return new AvlNode(key, value, null, null);
        }
        var comparison = this._compare(key, root.key);
        if (comparison < 0) {
            root.left = this._add(key, value, root.left);
        }
        else if (comparison > 0) {
            root.right = this._add(key, value, root.right);
        }
        else {
            // It's a duplicate so insertion failed, decrement size to make up for it
            this._size--;
            throw new Error("Key \"" + key + "\" already present in this avl tree");
        }
        var left = root.left;
        var right = root.right;
        var leftHeight = left ? left.height : -1;
        var rightHeight = right ? right.height : -1;
        // Update height and rebalance tree
        root.height = Math.max(leftHeight, rightHeight) + 1;
        /* tslint:disable:no-switch-case-fall-through */
        switch (leftHeight - rightHeight) {
            case 2:
                if (this._compare(key, left.key) < 0) {
                    // Left left case
                    return root = root.rotateRight();
                }
                else {
                    // Left right case
                    root.left = left.rotateLeft();
                    return root.rotateRight();
                }
            case -2:
                if (this._compare(key, right.key) > 0) {
                    // Right right case
                    return root = root.rotateLeft();
                }
                else {
                    // Right left case
                    root.right = right.rotateRight();
                    return root.rotateLeft();
                }
        }
        /* tslint:enable:no-switch-case-fall-through */
        return root;
    };
    /**
     * Inserts a new node with a specific key into the tree, when key already exists in the tree it gets replaced.
     *
     * @private
     * @param { Object } key The key being inserted.
     * @param { Object } value The value being inserted.
     * @return { Node } The new tree root.
     */
    Avl.prototype.put = function (key, value) {
        var result = value;
        this._size++;
        this._root = this._put(key, value, this._root);
    };
    /**
     * Lazily inserts a new node with a specific key into the tree.
     *
     * @private
     * @param { Object } key The key being inserted.
     * @param { Node } root The root of the tree to insert in.
     * @param { Object } value The value being inserted.
     * @return { Node } The new tree root.
     */
    Avl.prototype._put = function (key, value, root) {
        // Perform regular BST insertion
        if (root === null) {
            return new AvlNode(key, value);
        }
        var comparison = this._compare(key, root.key);
        if (comparison < 0) {
            root.left = this._put(key, value, root.left);
        }
        else if (comparison > 0) {
            root.right = this._put(key, value, root.right);
        }
        else {
            // It's a duplicate so insertion failed, decrement size to make up for it
            this._size--;
            return root;
        }
        var left = root.left;
        var right = root.right;
        var leftHeight = left ? left.height : -1;
        var rightHeight = right ? right.height : -1;
        // Update height and rebalance tree
        root.height = Math.max(leftHeight, rightHeight) + 1;
        /* tslint:disable:no-switch-case-fall-through */
        switch (leftHeight - rightHeight) {
            case 2:
                if (this._compare(key, left.key) < 0) {
                    // Left left case
                    return root = root.rotateRight();
                }
                else {
                    // Left right case
                    root.left = left.rotateLeft();
                    return root.rotateRight();
                }
            case -2:
                if (this._compare(key, right.key) > 0) {
                    // Right right case
                    return root = root.rotateLeft();
                }
                else {
                    // Right left case
                    root.right = right.rotateRight();
                    return root.rotateLeft();
                }
        }
        /* tslint:enable:no-switch-case-fall-through */
        return root;
    };
    /**
     * Inserts a new node with a specific key into the tree, when key already exists in the tree it gets replaced.
     *
     * @private
     * @param { Object } key The key being inserted.
     * @param { Object } value The value being inserted.
     * @return { Node } The new tree root.
     */
    Avl.prototype.set = function (key, value) {
        this._size++;
        this._root = this._set(key, value, this._root);
        return value;
    };
    /**
     * Lazily inserts a new node with a specific key into the tree.
     *
     * @private
     * @param { Object } key The key being inserted.
     * @param { Node } root The root of the tree to insert in.
     * @param { Object } value The value being inserted.
     * @return { Node } The new tree root.
     */
    Avl.prototype._set = function (key, value, root) {
        // Perform regular BST insertion
        if (root === null) {
            return new AvlNode(key, value);
        }
        var comparison = this._compare(key, root.key);
        if (comparison < 0) {
            root.left = this._set(key, value, root.left);
        }
        else if (comparison > 0) {
            root.right = this._set(key, value, root.right);
        }
        else {
            // It's a duplicate so insertion failed, decrement size to make up for it
            this._size--;
            root.key = key;
            root.value = value;
            return root;
        }
        // Update height and rebalance tree
        var left = root.left;
        var right = root.right;
        var leftHeight = left ? left.height : -1;
        var rightHeight = right ? right.height : -1;
        root.height = Math.max(leftHeight, rightHeight) + 1;
        /* tslint:disable:no-switch-case-fall-through */
        switch (leftHeight - rightHeight) {
            case 2:
                if (this._compare(key, left.key) < 0) {
                    // Left left case
                    return root = root.rotateRight();
                }
                else {
                    // Left right case
                    root.left = left.rotateLeft();
                    return root.rotateRight();
                }
            case -2:
                if (this._compare(key, right.key) > 0) {
                    // Right right case
                    return root = root.rotateLeft();
                }
                else {
                    // Right left case
                    root.right = right.rotateRight();
                    return root.rotateLeft();
                }
        }
        /* tslint:enable:no-switch-case-fall-through */
        return root;
    };
    /**
     * Deletes a node with a specific key from the tree.
     *
     * @private
     * @param { Object } key The key being deleted.
     * @return { Node } The new tree root.
     */
    Avl.prototype.remove = function (key) {
        this._root = this._remove(key, this._root);
        this._size--;
    };
    /**
     * Deletes a node with a specific key from the tree.
     *
     * @private
     * @param { Object } key The key being deleted.
     * @param { Node } root The root of the tree to delete from.
     * @return { Node } The new tree root.
     */
    Avl.prototype._remove = function (key, root) {
        // Perform regular BST deletion
        if (root === null) {
            this._size++;
            return root;
        }
        var comparison = this._compare(key, root.key);
        if (comparison < 0) {
            // The key to be deleted is in the left sub-tree
            root.left = this._remove(key, root.left);
        }
        else if (comparison > 0) {
            // The key to be deleted is in the right sub-tree
            root.right = this._remove(key, root.right);
        }
        else {
            // root is the node to be deleted
            if (!root.left && !root.right) {
                root = null;
            }
            else if (!root.left) {
                root = root.right;
            }
            else if (!root.right) {
                root = root.left;
            }
            else {
                // Node has 2 children, get the in-order successor
                var successor = this._min(root.right);
                root.key = successor.key;
                root.right = this._remove(successor.key, root.right);
            }
        }
        if (root === null) {
            return root;
        }
        var left = root.left;
        var right = root.right;
        var leftHeight = left ? left.height : -1;
        var rightHeight = right ? right.height : -1;
        // Update height and rebalance tree
        root.height = Math.max(leftHeight, rightHeight) + 1;
        switch (leftHeight - rightHeight) {
            case -2:
                var right_left = right.left;
                var right_right = right.right;
                if (1 === (right_left ? right_left.height : -1) - (right_right ? right_right.height : -1)) {
                    root.right = right.rotateRight();
                }
                return root.rotateLeft();
            case 2:
                var left_left = left.left;
                var left_right = left.right;
                if (1 === (left_right ? left_right.height : -1) - (left_left ? left_left.height : -1)) {
                    root.left = left.rotateLeft();
                }
                return root.rotateRight();
        }
        return root;
    };
    /**
     * Gets the value of a node within the tree with a specific key.
     *
     * @param { Object } key The key being searched for.
     * @return { Object } The value of the node or null if it doesn't exist.
     */
    Avl.prototype.get = function (key) {
        if (this._root === null) {
            return null;
        }
        var result = this._get(key, this._root);
        return result ? result.value : null;
    };
    /**
     * Gets the value of a node within the tree with a specific key.
     *
     * @private
     * @param { Object } key The key being searched for.
     * @param { Node } root The root of the tree to search in.
     * @return { Object } The value of the node or null if it doesn't exist.
     */
    Avl.prototype._get = function (key, root) {
        if (key === root.key) {
            return root;
        }
        if (this._compare(key, root.key) < 0) {
            if (!root.left) {
                return null;
            }
            return this._get(key, root.left);
        }
        if (!root.right) {
            return null;
        }
        return this._get(key, root.right);
    };
    ;
    /**
     * Gets whether a node with a specific key is within the tree.
     *
     * @param { Object } key The key being searched for.
     * @return { boolean } Whether a node with the key exists.
     */
    Avl.prototype.has = function (key) {
        if (this._root === null) {
            return false;
        }
        return !!this._get(key, this._root);
    };
    ;
    /**
     * @return { Object } The minimum key in the tree.
     */
    Avl.prototype.min = function () {
        if (this._root === null) {
            return null;
        }
        var result = this._min(this._root);
        return result && result.key;
    };
    ;
    /**
     * Gets the minimum value node, rooted in a particular node.
     *
     * @private
     * @param { Node } root The node to search.
     * @return { Node } The node with the minimum key in the tree.
     */
    Avl.prototype._min = function (root) {
        var current = root;
        while (current.left) {
            current = current.left;
        }
        return current;
    };
    /**
     * @return { Object } The maximum key in the tree.
     */
    Avl.prototype.max = function () {
        if (this._root === null) {
            return null;
        }
        var result = this._max(this._root);
        return result && result.key;
    };
    ;
    /**
     * Gets the maximum value node, rooted in a particular node.
     *
     * @private
     * @param { Node } root The node to search.
     * @return { Node } The node with the maximum key in the tree.
     */
    Avl.prototype._max = function (root) {
        var current = root;
        while (current.right) {
            current = current.right;
        }
        return current;
    };
    /**
     * Searches a tuple of 'previous', 'current', 'next' nodes relative to a key.
     *
     * @param key The key being searched for.
     * @param root The root of the tree to search in.
     * @return Whether a node with the key exists.
     */
    Avl.prototype.findValue = function (key) {
        return this._findValue(key, this._root, null, null);
    };
    /**
     * Gets a tuple of 'previous', 'current', 'next' values relative to a key.
     *
     * @param key The key being searched for.
     * @param root The root of the tree to search in.
     * @return Whether a node with the key exists.
     */
    Avl.prototype._findValue = function (key, root, prev, next) {
        if (root !== null) {
            var comparison = this._compare(key, root.key);
            if (comparison < 0) {
                if (root.left === null) {
                    return [prev && prev.value, null, root.value];
                }
                else {
                    return this._findValue(key, root.left, prev, root);
                }
            }
            else if (comparison > 0) {
                if (root.right === null) {
                    return [root.value, null, next && next.value];
                }
                else {
                    return this._findValue(key, root.right, root, next);
                }
            }
            else {
                return [prev && prev.value, root.value, next && next.value];
            }
        }
        else {
            return [null, null, null];
        }
    };
    /**
     * Searches a tuple of 'previous', 'current', 'next' nodes relative to a key.
     *
     * @param key The key being searched for.
     * @param root The root of the tree to search in.
     * @return Whether a node with the key exists.
     */
    Avl.prototype.findPair = function (key) {
        return this._findPair(key, this._root, null, null);
    };
    /**
     * Gets a tuple of 'previous', 'current', 'next' values relative to a key.
     *
     * @param key The key being searched for.
     * @param root The root of the tree to search in.
     * @return Whether a node with the key exists.
     */
    Avl.prototype._findPair = function (key, root, prev, next) {
        if (root !== null) {
            var comparison = this._compare(key, root.key);
            if (comparison < 0) {
                if (root.left === null) {
                    return [prev && [prev.key, prev.value], null, [root.key, root.value]];
                }
                else {
                    return this._findPair(key, root.left, prev, root);
                }
            }
            else if (comparison > 0) {
                if (root.right === null) {
                    return [[root.key, root.value], null, next && [next.key, next.value]];
                }
                else {
                    return this._findPair(key, root.right, root, next);
                }
            }
            else {
                return [prev && [prev.key, prev.value], [root.key, root.value], next && [next.key, next.value]];
            }
        }
        else {
            return [null, null, null];
        }
    };
    /**
     * Searches a tuple of 'previous', 'current', 'next' nodes relative to a key.
     *
     * @param key The key being searched for.
     * @param root The root of the tree to search in.
     * @return Whether a node with the key exists.
     */
    Avl.prototype.findKey = function (key) {
        return this._findKey(key, this._root, null, null);
    };
    /**
     * Gets a tuple of 'previous', 'current', 'next' keys relative to a key.
     *
     * @param key The key being searched for.
     * @param root The root of the tree to search in.
     * @return Whether a node with the key exists.
     */
    Avl.prototype._findKey = function (key, root, prev, next) {
        if (root !== null) {
            var comparison = this._compare(key, root.key);
            if (comparison < 0) {
                if (root.left === null) {
                    return [prev && prev.key, null, root.key];
                }
                else {
                    return this._findKey(key, root.left, prev, root);
                }
            }
            else if (comparison > 0) {
                if (root.right === null) {
                    return [root.key, null, next && next.key];
                }
                else {
                    return this._findKey(key, root.right, root, next);
                }
            }
            else {
                return [prev && prev.key, root.key, next && next.key];
            }
        }
        else {
            return [null, null, null];
        }
    };
    Avl.prototype.iterateForward = function (key, fn) {
        return this._iterateForward(key, this._root, fn) || null;
    };
    /**
     * Iterates a tree in from min() to max() direction starting from providded key while iterator function returns undefined
     *
     * @param key The key being searched for.
     * @param root The root of the tree to search in.
     * @return Whether a node with the key exists.
     */
    Avl.prototype._iterateForward = function (key, root, fn) {
        if (root !== null) {
            var result = void 0, comparison = this._compare(key, root.key);
            if (comparison < 0) {
                if (root.left === null) {
                    result = fn(root.value, root.key);
                    if (result !== void 0) {
                        return result;
                    }
                    return this._iterateForward(key, root.right, fn);
                }
                else {
                    result = this._iterateForward(key, root.left, fn);
                    if (result !== void 0) {
                        return result;
                    }
                    result = fn(root.value, root.key);
                    if (result !== void 0) {
                        return result;
                    }
                    return this._iterateForward(key, root.right, fn);
                }
            }
            else if (comparison > 0) {
                if (root.right === null) {
                    return void 0;
                }
                else {
                    return this._iterateForward(key, root.right, fn);
                }
            }
            else {
                return fn(root.value, root.key);
            }
        }
        else {
            return void 0;
        }
    };
    Avl.prototype.iterateReverse = function (key, fn) {
        return this._iterateReverse(key, this._root, fn) || null;
    };
    /**
     * Iterates a tree from max() to min() direction starting from providded key
     *
     * @param key The key being searched for.
     * @param root The root of the tree to search in.
     * @return Whether a node with the key exists.
     */
    Avl.prototype._iterateReverse = function (key, root, fn) {
        if (root !== null) {
            var result = void 0, comparison = this._compare(key, root.key);
            if (comparison < 0) {
                if (root.left === null) {
                    return void 0;
                }
                else {
                    return this._iterateReverse(key, root.left, fn);
                }
            }
            else if (comparison > 0) {
                if (root.right === null) {
                    result = fn(root.value, root.key);
                    if (result !== void 0) {
                        return result;
                    }
                    return this._iterateReverse(key, root.left, fn);
                }
                else {
                    result = this._iterateReverse(key, root.right, fn);
                    if (result !== void 0) {
                        return result;
                    }
                    result = fn(root.value, root.key);
                    if (result !== void 0) {
                        return result;
                    }
                    return this._iterateReverse(key, root.left, fn);
                }
            }
            else {
                return fn(root.value, root.key);
            }
        }
        else {
            return void 0;
        }
    };
    return Avl;
}());
exports.Avl = Avl;
