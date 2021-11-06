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
		this.initialised = true;

		if (opts) {
			if ((typeof opts) == 'object') {
				this.options = extend(true, this.options, opts);
			}
		}

		if (vals) {
			if (Array.isArray(vals)) {
				if(vals.length === 1 ) {
					this.root = this.add(vals[0]);
				} else {
					for (var i = 0; i < vals.length; i++) {
						this.root = this.add(vals[i]);
					}
				}

				if (!this.isBalanced()) {
					var node = this.balance();
				}
			}
		}
	}


	var addItem = function(node, key, value) {
		if (!node) {
			node = {
				key: key,
				value: value,
				parent: node,
				isRootNode: !node,
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
		if (key &&
			helpers.getType(key) != 'string') {
			throw new Error('key must be a string');
		}

		if (key) {
			this.root = addItem(this.root, key, value);
			return this.root;
		}

		switch (helpers.getType(value)) {
			case 'string':
			case 'number':
			case 'date':
				this.root = addItem(this.root, value, value);
				break;
			case 'object':
				this.root = addItem(this.root, value[this.options.key], value);
				break;
			case 'array':
			for (var i = 0; i < value.length; i++) {
				this.root = this.add(value[i]);
			}
		}

		return this.root;
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
		var items = this.items();
		this.root = null;

		this.root = balanceTree(this, items);

		return this;
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
		traverse(this.root, callback);
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
		var result = [];
		switch (helpers.getType(key)) {
			case 'object':
				for (var prop in key) {
					result = getByProperty(prop, key[prop], this.root);
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
		return minimum(this.root);
	}

	var maximum = function(node) {
		var current = node;
		while (current.right) {
			current = current.right;
		}
		return current;
	}

	btree.prototype.maximum = function() {
		return maximum(this.root);
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
			return;
		}

		if (key < node.key) {
			remove(node.left, key);
		} else if (key > node.key) {
			remove(node.right, key);
		} else {
			if (node.left && node.right) {
				var successor = minimum(node.right);
				if (!node.parent) {
					node.key = successor.key;
					node.value = successor.value;
				}
				remove(successor, successor.key);
			} else if (node.left) {
				replaceInParent(node, node.left);
			} else if (node.right) {
				replaceInParent(node, node.right);
			} else {
				replaceInParent(node, null);
			}
		}
	}

	btree.prototype.remove = function(key) {
		remove(this.root, key);
	}

})();
