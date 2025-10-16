# btreenode

A modern, high-performance binary search tree (BST) implementation for Node.js with AVL balancing, ES6+ features, and comprehensive error handling.

[![npm version](https://badge.fury.io/js/btreenode.svg)](https://badge.fury.io/js/btreenode)
[![Test Coverage](https://img.shields.io/badge/coverage-82.84%25-brightgreen.svg)](https://github.com/richhaigh/btreenode)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/richhaigh/btreenode)

## ✨ Features

- **🚀 Modern ES6+ Implementation** - Classes, arrow functions, template literals, destructuring
- **⚖️ AVL Tree Balancing** - Guaranteed O(log n) operations with automatic balancing
- **🛡️ Comprehensive Error Handling** - Detailed validation and clear error messages
- **📊 High Performance** - Optimized for large datasets with excellent time complexity
- **🔄 Full Backward Compatibility** - Existing code continues to work unchanged
- **🧪 Extensive Testing** - 69+ passing tests with 82.84% code coverage
- **📚 Complete Documentation** - JSDoc comments and comprehensive examples

## 🚀 Quick Start

### Installation

```bash
npm install btreenode
```

### Basic Usage

```javascript
const { BTree, createTree } = require('btreenode');

// Modern ES6+ class usage
const tree = new BTree();
tree.init(['apple', 'banana', 'cherry']);
console.log(tree.items()); // ['apple', 'banana', 'cherry']

// Legacy factory function (still supported)
const legacyTree = createTree(['x', 'y', 'z']);
```

## 📖 API Reference

### Constructor

```javascript
// Modern class
const tree = new BTree(options);

// Legacy factory function
const tree = createTree(values, options);
```

**Options:**
- `key` (string): Property name for object keys (default: 'id')

### Core Methods

#### `init(values, options)`
Initialize the tree with an array of values.

```javascript
// Simple values
tree.init(['apple', 'banana', 'cherry']);

// Objects with custom key
tree.init([
  { id: 1, name: 'apple' },
  { id: 2, name: 'banana' }
], { key: 'id' });
```

#### `add(value, key?)`
Add a value to the tree.

```javascript
// Simple values
tree.add('date');
tree.add(42);

// Objects
tree.add({ id: 3, name: 'grape' });

// With custom key
tree.add({ name: 'kiwi' }, 'name');
```

#### `remove(key)`
Remove a value from the tree.

```javascript
tree.remove('banana');
tree.remove(42);
```

#### `find(key)`
Find values in the tree.

```javascript
// Find by key (returns single value or array)
const result = tree.find('apple');

// Find by object property
const items = tree.find({ type: 'fruit' });

// Always get array results
const allResults = tree.findAll('apple');
```

#### `items()`
Get all items in the tree (sorted).

```javascript
const allItems = tree.items();
```

#### `forEach(callback)`
Iterate through all items.

```javascript
tree.forEach(item => {
  console.log('Item:', item);
});
```

### Tree Properties

#### `size()`
Get the number of items in the tree.

```javascript
const count = tree.size(); // 5
```

#### `isEmpty()`
Check if the tree is empty.

```javascript
if (tree.isEmpty()) {
  console.log('Tree is empty');
}
```

#### `clear()`
Remove all items from the tree.

```javascript
tree.clear();
```

### Min/Max Operations

#### `minimum()` / `maximum()`
Get the minimum/maximum values.

```javascript
const min = tree.minimum(); // 'apple'
const max = tree.maximum(); // 'date'
```

#### `getMinimumNode()` / `getMaximumNode()`
Get the minimum/maximum nodes (for advanced usage).

```javascript
const minNode = tree.getMinimumNode();
console.log(minNode.key, minNode.value);
```

### AVL Tree Features

#### `isAVLBalanced()`
Check if the tree maintains AVL balance.

```javascript
if (tree.isAVLBalanced()) {
  console.log('Tree is properly balanced');
}
```

#### `getHeight()`
Get the height of the tree.

```javascript
const height = tree.getHeight(); // 3
```

#### `getBalanceFactor()`
Get the balance factor of the root.

```javascript
const balance = tree.getBalanceFactor(); // -1, 0, or 1
```

## 🔧 Advanced Usage

### Custom Key Configuration

```javascript
const tree = new BTree({ key: 'name' });

tree.init([
  { id: 1, name: 'apple', type: 'fruit' },
  { id: 2, name: 'banana', type: 'fruit' }
]);

// Items are sorted by 'name' property
console.log(tree.items());
// [{ id: 2, name: 'banana', type: 'fruit' }, { id: 1, name: 'apple', type: 'fruit' }]
```

### Complex Object Handling

```javascript
const tree = new BTree();

const complexItems = [
  { id: 1, data: { name: 'apple', metadata: { color: 'red' } } },
  { id: 2, data: { name: 'banana', metadata: { color: 'yellow' } } }
];

tree.init(complexItems);
const found = tree.find(1);
console.log(found.data.metadata.color); // 'red'
```

### Performance Optimization

```javascript
// For large datasets, the tree automatically maintains balance
const tree = new BTree();

// Insert 10,000 items - still O(log n) per operation
for (let i = 1; i <= 10000; i++) {
  tree.add(i);
}

console.log(tree.getHeight()); // ~14 levels (optimal)
console.log(tree.isAVLBalanced()); // true
```

## 🧪 Testing

The project includes comprehensive test suites:

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:modern      # Modern functionality tests
npm run test:avl         # AVL balancing tests
npm run test:errors      # Error handling tests
npm run test:performance # Performance benchmarks
npm run test:legacy      # Legacy compatibility tests

# Run with coverage
npm run test:coverage
```

### Test Coverage
- **82.84% Statement Coverage**
- **75.86% Branch Coverage**
- **92.3% Function Coverage**
- **82.72% Line Coverage**

## 📊 Performance

### Time Complexity
- **Insertion**: O(log n) guaranteed
- **Deletion**: O(log n) guaranteed
- **Search**: O(log n) guaranteed
- **Balancing**: O(log n) with AVL rotations

### Benchmarks
- **1,000 insertions**: < 100ms
- **10,000 insertions**: < 1,000ms
- **1,000 searches**: < 50ms
- **Tree height for 10K items**: ≤ 14 levels

## 🔄 Migration Guide

### From Legacy API

The modern implementation is fully backward compatible:

```javascript
// Old way (still works)
const tree = require('btreenode');
const btree = new tree.createTree();

// New way (recommended)
const { BTree } = require('btreenode');
const tree = new BTree();
```

## 🛠️ Error Handling

The implementation includes comprehensive error handling:

```javascript
try {
  tree.add(null); // Throws: "Value cannot be undefined or null"
  tree.remove('nonexistent'); // Throws: "Key 'nonexistent' not found in tree"
  tree.minimum(); // Throws: "Cannot find minimum in empty tree"
} catch (error) {
  console.error('Error:', error.message);
}
```

## 📚 Examples

### Complete Example

```javascript
const { BTree } = require('btreenode');

// Create and initialize tree
const tree = new BTree();
tree.init([
  { id: 3, name: 'cherry', type: 'fruit' },
  { id: 1, name: 'apple', type: 'fruit' },
  { id: 2, name: 'banana', type: 'fruit' }
]);

// Add more items
tree.add({ id: 4, name: 'date', type: 'fruit' });
tree.add({ id: 5, name: 'carrot', type: 'vegetable' });

// Find items
const fruits = tree.find({ type: 'fruit' });
console.log('Fruits:', fruits);

// Remove items
tree.remove('banana');

// Iterate through tree
tree.forEach(item => {
  console.log(`${item.name} (${item.type})`);
});

// Check tree properties
console.log('Size:', tree.size());
console.log('Height:', tree.getHeight());
console.log('Balanced:', tree.isAVLBalanced());
console.log('Min:', tree.minimum());
console.log('Max:', tree.maximum());
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `npm test`
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## 📄 License

ISC License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- AVL tree balancing algorithm
- Modern JavaScript ES6+ features
- Comprehensive test coverage with Mocha and Chai
- Performance optimization techniques

---

**Made with ❤️ for the Node.js community**