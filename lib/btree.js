(function() {
	var helpers = require('./helpers'),
		extend = require('node.extend');

	var btree = function() {
		this.initialised = true;
		this.root = null;
		this.options = {
			key: 'id'
		};
	}


	var setupTree = function(vals, opts) {
		return new btree();
	}

	exports.createTree = function(vals, opts) {
		return setupTree();
	}

	btree.prototype.init = function(vals, opts) {
		try {
			this.initialised = true;

			// Validate options
			if (opts) {
				if (typeof opts !== 'object') {
					throw new Error('Options must be an object');
				}
				if (opts.key && typeof opts.key !== 'string') {
					throw new Error('Key option must be a string');
				}
				this.options = extend(true, this.options, opts);
			}

			// Validate values
			if (vals !== undefined && vals !== null) {
				if (!Array.isArray(vals)) {
					throw new Error('Values must be an array');
				}
				
				// Check for empty array
				if (vals.length === 0) {
					this.root = null;
					return;
				}

				// Add values one by one with error handling
				for (var i = 0; i < vals.length; i++) {
					try {
						this.root = this.add(vals[i]);
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


	var addItem = function(node, key, value) {
		if (!node) {
			node = {
				key: key,
				value: value,
				parent: node,
				left: null,
				right: null
			};
		} else if (key < node.key) {
			node.left = addItem(node.left, key, value);
			node.left.parent = node;
		} else if (key >= node.key) {
			node.right = addItem(node.right, key, value);
			node.right.parent = node;
		}

		return node;
	}

	btree.prototype.add = function(value, key) {
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
				this.root = addItem(this.root, key, value);
				return this.root;
			}

			// Handle different value types
			switch (helpers.getType(value)) {
				case 'string':
				case 'number':
				case 'date':
					this.root = addItem(this.root, value, value);
					break;
				case 'object':
					// Validate object has required key
					if (!value.hasOwnProperty(this.options.key)) {
						throw new Error(`Object must have property '${this.options.key}'`);
					}
					if (value[this.options.key] === undefined || value[this.options.key] === null) {
						throw new Error(`Object property '${this.options.key}' cannot be undefined or null`);
					}
					this.root = addItem(this.root, value[this.options.key], value);
					break;
				case 'array':
					// Handle array of objects
					for (var i = 0; i < value.length; i++) {
						if (!value[i].hasOwnProperty(this.options.key)) {
							throw new Error(`Array item at index ${i} must have property '${this.options.key}'`);
						}
						if (value[i][this.options.key] === undefined || value[i][this.options.key] === null) {
							throw new Error(`Array item at index ${i} property '${this.options.key}' cannot be undefined or null`);
						}
						this.root = addItem(this.root, value[i][this.options.key], value[i]);
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

	var balanceTree = function(tree, items) {
		if (!items ||
			items.length == 0) {
			return;
		}

		if (items.length === 1) {
			tree.add(items[0]);
			return;
		}

		var splitCount = Math.ceil(items.length / 2);
		var left = items.slice(0, splitCount - 1);
		var right = items.slice(splitCount);

		var mid = items[splitCount - 1];

		if (!mid) {
			return;
		}

		tree.add(mid);

		balanceTree(tree, left);

		if (right &&
			right.length > 0) {
			balanceTree(tree, right);
		}

		return tree.root;

	}

	btree.prototype.balance = function() {
		try {
			// Check if tree is empty
			if (!this.root) {
				return this;
			}

			var items = this.items();
			if (!items || items.length === 0) {
				return this;
			}

			this.root = null;
			this.root = balanceTree(this, items);

			return this;
		} catch (error) {
			throw new Error(`Failed to balance tree: ${error.message}`);
		}
	}

	var isBST = function(node, minKey, maxKey) {
		if (!node || (!(node.left) && !(node.right))) {
			return true;
		}


		if (node.key < minKey || node.key > maxKey) {
			return false;
		}

		return isBST(node.left, minKey, node.key) &&
			isBST(node.right, node.key, maxKey);
	}

	btree.prototype.isBalanced = function() {
		return isBST(this.root, this.minimum(), this.maximum());
	}

	var traverse = function(node, callback) {
		if (!node) {
			return;
		}
		traverse(node.left, callback);
		callback(node.value);
		traverse(node.right, callback);
	}

	btree.prototype.forEach = function(callback) {
		try {
			if (typeof callback !== 'function') {
				throw new Error('Callback must be a function');
			}
			traverse(this.root, callback);
		} catch (error) {
			throw new Error(`Failed to iterate tree: ${error.message}`);
		}
	}

	var getByKey = function(key, node) {
		if (!node) {
			return;
		}

		if (key == node.key) {
			return node;
		} else if (key < node.key) {
			return getByKey(key, node.left);
		} else if (key > node.key) {
			return getByKey(key, node.right);
		}
	}

	var getByProperty = function(name, value, node) {
		if (!node) {
			return;
		}
		var items = [];

		traverse(node, function(nodeValue) {
			if (nodeValue[name] == value) {
				items.push(nodeValue);
			}
		});

		return items;
	}

	btree.prototype.find = function(key) {
		try {
			// Validate input
			if (key === undefined || key === null) {
				throw new Error('Key cannot be undefined or null');
			}

			var result = [];
			switch (helpers.getType(key)) {
				case 'object':
					// Validate object has at least one property
					var hasProperties = false;
					for (var prop in key) {
						if (key.hasOwnProperty(prop)) {
							hasProperties = true;
							break;
						}
					}
					if (!hasProperties) {
						throw new Error('Search object must have at least one property');
					}
					
					for (var prop in key) {
						if (key.hasOwnProperty(prop)) {
							result = getByProperty(prop, key[prop], this.root);
						}
					}
					break;
				default:
					var item = getByKey(key, this.root);
					if (item) {
						result.push(item.value);
					}
					break;
			}
			return result;
		} catch (error) {
			throw new Error(`Failed to find key: ${error.message}`);
		}
	}

	btree.prototype.items = function() {
		var items = [];
		traverse(this.root, function(item) {
			items.push(item);
		});
		return (items);
	}

	var minimum = function(node) {
		var current = node;
		while (current.left) {
			current = current.left
		}
		return current;
	}

	btree.prototype.minimum = function() {
		try {
			if (!this.root) {
				throw new Error('Cannot find minimum in empty tree');
			}
			return minimum(this.root);
		} catch (error) {
			throw new Error(`Failed to find minimum: ${error.message}`);
		}
	}

	var maximum = function(node) {
		var current = node;
		while (current.right) {
			current = current.right;
		}
		return current;
	}

	btree.prototype.maximum = function() {
		try {
			if (!this.root) {
				throw new Error('Cannot find maximum in empty tree');
			}
			return maximum(this.root);
		} catch (error) {
			throw new Error(`Failed to find maximum: ${error.message}`);
		}
	}

	var replaceInParent = function(node, newValue) {
		if (node.parent) {
			if (node.parent.left && node.key == node.parent.left.key) {
				node.parent.left = newValue;
			} else if (node.parent.right) {
				node.parent.right = newValue;
			}
		}
		if (newValue) {
			newValue.parent = node.parent;
		}
	}

	var remove = function(node, key) {
		if (!node) {
			return null;
		}

		if (key < node.key) {
			node.left = remove(node.left, key);
		} else if (key > node.key) {
			node.right = remove(node.right, key);
		} else {
			// Node to be deleted found
			if (!node.left) {
				return node.right;
			} else if (!node.right) {
				return node.left;
			}
			
			// Node with two children: get the inorder successor
			var successor = minimum(node.right);
			node.key = successor.key;
			node.value = successor.value;
			node.right = remove(node.right, successor.key);
		}
		
		return node;
	}

	btree.prototype.remove = function(key) {
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
			var existing = this.find(key);
			if (existing.length === 0) {
				throw new Error(`Key '${key}' not found in tree`);
			}

			this.root = remove(this.root, key);
		} catch (error) {
			throw new Error(`Failed to remove key '${key}': ${error.message}`);
		}
	}

})();
