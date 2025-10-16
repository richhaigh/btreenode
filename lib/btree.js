const helpers = require('./helpers');
const extend = require('node.extend');

/**
 * Modern ES6+ B-tree implementation
 * Provides a binary search tree with modern JavaScript features
 */
class BTree {
    constructor(options = {}) {
        this.initialized = true;
        this.root = null;
        this.options = {
            key: 'id',
            ...options
        };
    }

    /**
     * Initialize the tree with values and options
     * @param {Array} values - Array of values to initialize with
     * @param {Object} options - Configuration options
     */
    init(values, options = {}) {
        try {
            this.initialized = true;

            // Validate options
            if (options && typeof options !== 'object') {
                throw new Error('Options must be an object');
            }
            if (options.key && typeof options.key !== 'string') {
                throw new Error('Key option must be a string');
            }
            this.options = { ...this.options, ...options };

            // Validate values
            if (values !== undefined && values !== null) {
                if (!Array.isArray(values)) {
                    throw new Error('Values must be an array');
                }
                
                // Handle empty array
                if (values.length === 0) {
                    this.root = null;
                    return;
                }

                // Add values one by one with error handling
                for (let i = 0; i < values.length; i++) {
                    try {
                        this.root = this.add(values[i]);
                    } catch (error) {
                        throw new Error(`Failed to add item at index ${i}: ${error.message}`);
                    }
                }

                // Balance tree if needed
                if (!this.isBalanced()) {
                    this.balance();
                }
            }
        } catch (error) {
            throw new Error(`Tree initialization failed: ${error.message}`);
        }
    }

    /**
     * Add a value to the tree
     * @param {*} value - Value to add
     * @param {*} key - Optional key (if not provided, uses value or value[options.key])
     * @returns {Object} The root node
     */
    add(value, key) {
        try {
            // Validate input
            if (value === undefined || value === null) {
                throw new Error('Value cannot be undefined or null');
            }

            // Validate key if provided
            if (key !== undefined) {
                if (helpers.getType(key) !== 'string' && helpers.getType(key) !== 'number') {
                    throw new Error('Key must be a string or number');
                }
                this.root = this._addItem(this.root, key, value);
                return this.root;
            }

            // Handle different value types
            switch (helpers.getType(value)) {
                case 'string':
                case 'number':
                case 'date':
                    this.root = this._addItem(this.root, value, value);
                    break;
                case 'object':
                    // Validate object has required key
                    if (!value.hasOwnProperty(this.options.key)) {
                        throw new Error(`Object must have property '${this.options.key}'`);
                    }
                    if (value[this.options.key] === undefined || value[this.options.key] === null) {
                        throw new Error(`Object property '${this.options.key}' cannot be undefined or null`);
                    }
                    this.root = this._addItem(this.root, value[this.options.key], value);
                    break;
                case 'array':
                    // Handle array of objects
                    for (let i = 0; i < value.length; i++) {
                        if (!value[i].hasOwnProperty(this.options.key)) {
                            throw new Error(`Array item at index ${i} must have property '${this.options.key}'`);
                        }
                        if (value[i][this.options.key] === undefined || value[i][this.options.key] === null) {
                            throw new Error(`Array item at index ${i} property '${this.options.key}' cannot be undefined or null`);
                        }
                        this.root = this._addItem(this.root, value[i][this.options.key], value[i]);
                    }

                    if (!this.isBalanced()) {
                        this.balance();
                    }
                    break;
                default:
                    throw new Error(`Unsupported value type: ${helpers.getType(value)}`);
            }

            return this.root;
        } catch (error) {
            throw new Error(`Failed to add value: ${error.message}`);
        }
    }

    /**
     * Internal method to add item to tree
     * @private
     */
    _addItem(node, key, value) {
        if (!node) {
            return {
                key,
                value,
                parent: null,
                left: null,
                right: null
            };
        } else if (key < node.key) {
            node.left = this._addItem(node.left, key, value);
            node.left.parent = node;
        } else if (key >= node.key) {
            node.right = this._addItem(node.right, key, value);
            node.right.parent = node;
        }
        return node;
    }

    /**
     * Remove a value from the tree
     * @param {*} key - Key to remove
     */
    remove(key) {
        try {
            // Validate input
            if (key === undefined || key === null) {
                throw new Error('Key cannot be undefined or null');
            }

            // Check if tree is empty
            if (!this.root) {
                throw new Error('Cannot remove from empty tree');
            }

            // Check if key exists before attempting removal
            const existing = this.find(key);
            if (existing.length === 0) {
                throw new Error(`Key '${key}' not found in tree`);
            }

            this.root = this._remove(this.root, key);
        } catch (error) {
            throw new Error(`Failed to remove key '${key}': ${error.message}`);
        }
    }

    /**
     * Internal method to remove item from tree
     * @private
     */
    _remove(node, key) {
        if (!node) {
            return null;
        }

        if (key < node.key) {
            node.left = this._remove(node.left, key);
        } else if (key > node.key) {
            node.right = this._remove(node.right, key);
        } else {
            // Node to be deleted found
            if (!node.left) {
                return node.right;
            } else if (!node.right) {
                return node.left;
            }
            
            // Node with two children: get the inorder successor
            const successor = this._minimum(node.right);
            node.key = successor.key;
            node.value = successor.value;
            node.right = this._remove(node.right, successor.key);
        }
        
        return node;
    }

    /**
     * Find values in the tree
     * @param {*} key - Key to search for
     * @returns {*} Single value for single results, array for multiple
     */
    find(key) {
        try {
            // Validate input
            if (key === undefined || key === null) {
                throw new Error('Key cannot be undefined or null');
            }

            let result = [];
            switch (helpers.getType(key)) {
                case 'object':
                    // Validate object has at least one property
                    const hasProperties = Object.keys(key).length > 0;
                    if (!hasProperties) {
                        throw new Error('Search object must have at least one property');
                    }
                    
                    for (const prop in key) {
                        if (key.hasOwnProperty(prop)) {
                            result = this._getByProperty(prop, key[prop], this.root);
                        }
                    }
                    break;
                default:
                    const item = this._getByKey(key, this.root);
                    if (item) {
                        result.push(item.value);
                    }
                    break;
            }
            
            // Return single value for single results, array for multiple
            return result.length === 1 ? result[0] : result;
        } catch (error) {
            throw new Error(`Failed to find key: ${error.message}`);
        }
    }

    /**
     * Find all values matching the key (always returns array)
     * @param {*} key - Key to search for
     * @returns {Array} Array of matching values
     */
    findAll(key) {
        try {
            // Validate input
            if (key === undefined || key === null) {
                throw new Error('Key cannot be undefined or null');
            }

            let result = [];
            switch (helpers.getType(key)) {
                case 'object':
                    // Validate object has at least one property
                    const hasProperties = Object.keys(key).length > 0;
                    if (!hasProperties) {
                        throw new Error('Search object must have at least one property');
                    }
                    
                    for (const prop in key) {
                        if (key.hasOwnProperty(prop)) {
                            result = this._getByProperty(prop, key[prop], this.root);
                        }
                    }
                    break;
                default:
                    const item = this._getByKey(key, this.root);
                    if (item) {
                        result.push(item.value);
                    }
                    break;
            }
            
            // Always return array
            return result;
        } catch (error) {
            throw new Error(`Failed to find all matching keys: ${error.message}`);
        }
    }

    /**
     * Get all items in the tree
     * @returns {Array} Array of all values
     */
    items() {
        const items = [];
        this._traverse(this.root, (item) => {
            items.push(item);
        });
        return items;
    }

    /**
     * Iterate through all items in the tree
     * @param {Function} callback - Function to call for each item
     */
    forEach(callback) {
        try {
            if (typeof callback !== 'function') {
                throw new Error('Callback must be a function');
            }
            this._traverse(this.root, callback);
        } catch (error) {
            throw new Error(`Failed to iterate tree: ${error.message}`);
        }
    }

    /**
     * Get the minimum value in the tree
     * @returns {*} Minimum value
     */
    minimum() {
        try {
            if (!this.root) {
                throw new Error('Cannot find minimum in empty tree');
            }
            const minNode = this._minimum(this.root);
            return minNode ? minNode.value : null;
        } catch (error) {
            throw new Error(`Failed to find minimum: ${error.message}`);
        }
    }

    /**
     * Get the maximum value in the tree
     * @returns {*} Maximum value
     */
    maximum() {
        try {
            if (!this.root) {
                throw new Error('Cannot find maximum in empty tree');
            }
            const maxNode = this._maximum(this.root);
            return maxNode ? maxNode.value : null;
        } catch (error) {
            throw new Error(`Failed to find maximum: ${error.message}`);
        }
    }

    /**
     * Get the minimum node in the tree
     * @returns {Object} Minimum node
     */
    getMinimumNode() {
        try {
            if (!this.root) {
                throw new Error('Cannot find minimum in empty tree');
            }
            return this._minimum(this.root);
        } catch (error) {
            throw new Error(`Failed to find minimum node: ${error.message}`);
        }
    }

    /**
     * Get the maximum node in the tree
     * @returns {Object} Maximum node
     */
    getMaximumNode() {
        try {
            if (!this.root) {
                throw new Error('Cannot find maximum in empty tree');
            }
            return this._maximum(this.root);
        } catch (error) {
            throw new Error(`Failed to find maximum node: ${error.message}`);
        }
    }

    /**
     * Check if the tree is balanced
     * @returns {boolean} True if balanced
     */
    isBalanced() {
        return this._isBST(this.root, this.minimum(), this.maximum());
    }

    /**
     * Balance the tree
     * @returns {BTree} This tree instance
     */
    balance() {
        try {
            // Check if tree is empty
            if (!this.root) {
                return this;
            }

            const items = this.items();
            if (!items || items.length === 0) {
                return this;
            }

            this.root = null;
            this.root = this._balanceTree(items);

            return this;
        } catch (error) {
            throw new Error(`Failed to balance tree: ${error.message}`);
        }
    }

    /**
     * Get tree size
     * @returns {number} Number of items in the tree
     */
    size() {
        return this.items().length;
    }

    /**
     * Check if tree is empty
     * @returns {boolean} True if empty
     */
    isEmpty() {
        return !this.root;
    }

    /**
     * Clear the tree
     */
    clear() {
        this.root = null;
    }

    // Private helper methods

    _traverse(node, callback) {
        if (!node) {
            return;
        }
        this._traverse(node.left, callback);
        callback(node.value);
        this._traverse(node.right, callback);
    }

    _getByKey(key, node) {
        if (!node) {
            return null;
        }

        if (key === node.key) {
            return node;
        } else if (key < node.key) {
            return this._getByKey(key, node.left);
        } else if (key > node.key) {
            return this._getByKey(key, node.right);
        }
    }

    _getByProperty(name, value, node) {
        if (!node) {
            return [];
        }
        const items = [];

        this._traverse(node, (nodeValue) => {
            if (nodeValue[name] === value) {
                items.push(nodeValue);
            }
        });

        return items;
    }

    _minimum(node) {
        let current = node;
        while (current.left) {
            current = current.left;
        }
        return current;
    }

    _maximum(node) {
        let current = node;
        while (current.right) {
            current = current.right;
        }
        return current;
    }

    _isBST(node, minKey, maxKey) {
        if (!node || (!node.left && !node.right)) {
            return true;
        }

        if (node.key < minKey || node.key > maxKey) {
            return false;
        }

        return this._isBST(node.left, minKey, node.key) &&
               this._isBST(node.right, node.key, maxKey);
    }

    _balanceTree(items) {
        if (!items || items.length === 0) {
            return null;
        }

        if (items.length === 1) {
            this.add(items[0]);
            return this.root;
        }

        const splitCount = Math.ceil(items.length / 2);
        const left = items.slice(0, splitCount - 1);
        const right = items.slice(splitCount);
        const mid = items[splitCount - 1];

        if (!mid) {
            return null;
        }

        this.add(mid);

        this._balanceTree(left);

        if (right && right.length > 0) {
            this._balanceTree(right);
        }

        return this.root;
    }
}

// Factory function for backward compatibility
function createTree(values, options) {
    const tree = new BTree(options);
    if (values) {
        tree.init(values, options);
    }
    return tree;
}

module.exports = {
    BTree,
    createTree
};
