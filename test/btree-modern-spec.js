const expect = require('chai').expect;
const { BTree, createTree } = require('../lib/btree');

describe('BTree Modern Implementation', function() {
    let tree;

    beforeEach(function() {
        tree = new BTree();
    });

    describe('Constructor and Initialization', function() {
        it('should create an empty tree', function() {
            expect(tree).to.be.instanceOf(BTree);
            expect(tree.isEmpty()).to.be.true;
            expect(tree.size()).to.equal(0);
            expect(tree.getHeight()).to.equal(0);
        });

        it('should create tree with custom options', function() {
            const customTree = new BTree({ key: 'name' });
            expect(customTree.options.key).to.equal('name');
        });

        it('should initialize with values', function() {
            tree.init(['apple', 'banana', 'cherry']);
            expect(tree.size()).to.equal(3);
            expect(tree.items()).to.deep.equal(['apple', 'banana', 'cherry']);
        });

        it('should initialize with objects using custom key', function() {
            const items = [
                { id: 3, name: 'cherry' },
                { id: 1, name: 'apple' },
                { id: 2, name: 'banana' }
            ];
            tree.init(items, { key: 'id' });
            expect(tree.size()).to.equal(3);
            expect(tree.items()).to.deep.equal([
                { id: 1, name: 'apple' },
                { id: 2, name: 'banana' },
                { id: 3, name: 'cherry' }
            ]);
        });

        it('should handle empty initialization', function() {
            tree.init([]);
            expect(tree.isEmpty()).to.be.true;
            expect(tree.size()).to.equal(0);
        });
    });

    describe('Factory Function', function() {
        it('should create tree using factory function', function() {
            const factoryTree = createTree(['a', 'b', 'c']);
            expect(factoryTree).to.be.instanceOf(BTree);
            expect(factoryTree.size()).to.equal(3);
        });

        it('should create empty tree using factory function', function() {
            const factoryTree = createTree();
            expect(factoryTree).to.be.instanceOf(BTree);
            expect(factoryTree.isEmpty()).to.be.true;
        });
    });

    describe('Adding Items', function() {
        it('should add string values', function() {
            tree.add('apple');
            expect(tree.size()).to.equal(1);
            expect(tree.find('apple')).to.equal('apple');
        });

        it('should add number values', function() {
            tree.add(42);
            expect(tree.size()).to.equal(1);
            expect(tree.find(42)).to.equal(42);
        });

        it('should add object values', function() {
            const item = { id: 1, name: 'apple' };
            tree.add(item);
            expect(tree.size()).to.equal(1);
            expect(tree.find(1)).to.deep.equal(item);
        });

        it('should add with custom key', function() {
            const item = { id: 1, name: 'apple' };
            tree.add(item, 'name');
            expect(tree.find('name')).to.deep.equal(item);
        });

        it('should handle array of objects', function() {
            const items = [
                { id: 3, name: 'cherry' },
                { id: 1, name: 'apple' },
                { id: 2, name: 'banana' }
            ];
            tree.add(items);
            expect(tree.size()).to.equal(3);
            expect(tree.items()).to.deep.equal([
                { id: 1, name: 'apple' },
                { id: 2, name: 'banana' },
                { id: 3, name: 'cherry' }
            ]);
        });
    });

    describe('Finding Items', function() {
        beforeEach(function() {
            tree.init(['apple', 'banana', 'cherry', 'date']);
        });

        it('should find existing items', function() {
            expect(tree.find('banana')).to.equal('banana');
            expect(tree.find('apple')).to.equal('apple');
        });

        it('should return empty array for non-existing items', function() {
            expect(tree.find('grape')).to.deep.equal([]);
        });

        it('should find items by object property', function() {
            tree.clear();
            tree.init([
                { id: 1, name: 'apple' },
                { id: 2, name: 'banana' },
                { id: 3, name: 'cherry' }
            ]);
            expect(tree.find({ name: 'banana' })).to.deep.equal({ id: 2, name: 'banana' });
        });

        it('should find multiple items with same property', function() {
            tree.clear();
            tree.init([
                { id: 1, name: 'apple', type: 'fruit' },
                { id: 2, name: 'banana', type: 'fruit' },
                { id: 3, name: 'carrot', type: 'vegetable' }
            ]);
            const results = tree.find({ type: 'fruit' });
            expect(results).to.be.an('array');
            expect(results).to.have.length(2);
        });

        it('should use findAll to always get arrays', function() {
            expect(tree.findAll('banana')).to.be.an('array');
            expect(tree.findAll('banana')).to.have.length(1);
            expect(tree.findAll('grape')).to.be.an('array');
            expect(tree.findAll('grape')).to.have.length(0);
        });
    });

    describe('Removing Items', function() {
        beforeEach(function() {
            tree.init(['apple', 'banana', 'cherry', 'date']);
        });

        it('should remove existing items', function() {
            tree.remove('banana');
            expect(tree.size()).to.equal(3);
            expect(tree.find('banana')).to.deep.equal([]);
            expect(tree.items()).to.deep.equal(['apple', 'cherry', 'date']);
        });

        it('should remove root item', function() {
            tree.remove('banana'); // Assuming this is the root
            expect(tree.size()).to.equal(3);
            expect(tree.isAVLBalanced()).to.be.true;
        });

        it('should remove leaf items', function() {
            tree.remove('apple');
            expect(tree.size()).to.equal(3);
            expect(tree.isAVLBalanced()).to.be.true;
        });

        it('should remove items with two children', function() {
            tree.remove('banana');
            expect(tree.size()).to.equal(3);
            expect(tree.isAVLBalanced()).to.be.true;
        });
    });

    describe('Tree Traversal', function() {
        beforeEach(function() {
            tree.init(['apple', 'banana', 'cherry', 'date']);
        });

        it('should iterate through all items', function() {
            const items = [];
            tree.forEach(item => items.push(item));
            expect(items).to.deep.equal(['apple', 'banana', 'cherry', 'date']);
        });

        it('should get all items as array', function() {
            expect(tree.items()).to.deep.equal(['apple', 'banana', 'cherry', 'date']);
        });
    });

    describe('Min/Max Operations', function() {
        beforeEach(function() {
            tree.init(['apple', 'banana', 'cherry', 'date']);
        });

        it('should find minimum value', function() {
            expect(tree.minimum()).to.equal('apple');
        });

        it('should find maximum value', function() {
            expect(tree.maximum()).to.equal('date');
        });

        it('should get minimum node', function() {
            const minNode = tree.getMinimumNode();
            expect(minNode).to.have.property('key', 'apple');
            expect(minNode).to.have.property('value', 'apple');
        });

        it('should get maximum node', function() {
            const maxNode = tree.getMaximumNode();
            expect(maxNode).to.have.property('key', 'date');
            expect(maxNode).to.have.property('value', 'date');
        });
    });

    describe('Tree Properties', function() {
        it('should track size correctly', function() {
            expect(tree.size()).to.equal(0);
            tree.add('apple');
            expect(tree.size()).to.equal(1);
            tree.add('banana');
            expect(tree.size()).to.equal(2);
        });

        it('should check if empty', function() {
            expect(tree.isEmpty()).to.be.true;
            tree.add('apple');
            expect(tree.isEmpty()).to.be.false;
        });

        it('should clear all items', function() {
            tree.init(['apple', 'banana', 'cherry']);
            expect(tree.size()).to.equal(3);
            tree.clear();
            expect(tree.isEmpty()).to.be.true;
            expect(tree.size()).to.equal(0);
        });
    });

    describe('AVL Balancing', function() {
        it('should maintain balance with sequential insertions', function() {
            for (let i = 1; i <= 10; i++) {
                tree.add(i);
            }
            expect(tree.isAVLBalanced()).to.be.true;
            expect(tree.getHeight()).to.be.at.most(4); // log2(10) ≈ 3.3, so height ≤ 4
        });

        it('should maintain balance with reverse sequential insertions', function() {
            for (let i = 10; i >= 1; i--) {
                tree.add(i);
            }
            expect(tree.isAVLBalanced()).to.be.true;
            expect(tree.getHeight()).to.be.at.most(4);
        });

        it('should maintain balance after deletions', function() {
            for (let i = 1; i <= 15; i++) {
                tree.add(i);
            }
            expect(tree.isAVLBalanced()).to.be.true;
            
            tree.remove(5);
            tree.remove(10);
            tree.remove(15);
            
            expect(tree.isAVLBalanced()).to.be.true;
        });

        it('should have optimal height for large datasets', function() {
            for (let i = 1; i <= 1000; i++) {
                tree.add(i);
            }
            expect(tree.isAVLBalanced()).to.be.true;
            expect(tree.getHeight()).to.be.at.most(10); // log2(1000) ≈ 9.97
        });

        it('should have balance factor within valid range', function() {
            for (let i = 1; i <= 100; i++) {
                tree.add(i);
            }
            const balanceFactor = tree.getBalanceFactor();
            expect(balanceFactor).to.be.at.least(-1);
            expect(balanceFactor).to.be.at.most(1);
        });
    });

    describe('Error Handling', function() {
        it('should throw error for invalid init values', function() {
            expect(() => tree.init('not an array')).to.throw('Values must be an array');
        });

        it('should throw error for null values in add', function() {
            expect(() => tree.add(null)).to.throw('Value cannot be undefined or null');
        });

        it('should throw error for undefined values in add', function() {
            expect(() => tree.add(undefined)).to.throw('Value cannot be undefined or null');
        });

        it('should throw error for invalid key in add', function() {
            expect(() => tree.add('value', {})).to.throw('Key must be a string or number');
            expect(() => tree.add('value', [])).to.throw('Key must be a string or number');
            expect(() => tree.add('value', null)).to.throw('Key must be a string or number');
        });

        it('should throw error for object without required key', function() {
            expect(() => tree.add({ name: 'apple' })).to.throw("Object must have property 'id'");
        });

        it('should throw error for removing from empty tree', function() {
            expect(() => tree.remove('anything')).to.throw('Cannot remove from empty tree');
        });

        it('should throw error for removing non-existing item', function() {
            tree.add('apple');
            expect(() => tree.remove('banana')).to.throw("Key 'banana' not found in tree");
        });

        it('should throw error for invalid find key', function() {
            expect(() => tree.find(null)).to.throw('Key cannot be undefined or null');
        });

        it('should throw error for invalid forEach callback', function() {
            expect(() => tree.forEach('not a function')).to.throw('Callback must be a function');
        });

        it('should throw error for minimum on empty tree', function() {
            expect(() => tree.minimum()).to.throw('Cannot find minimum in empty tree');
        });

        it('should throw error for maximum on empty tree', function() {
            expect(() => tree.maximum()).to.throw('Cannot find maximum in empty tree');
        });
    });

    describe('Performance Tests', function() {
        it('should handle large number of insertions efficiently', function() {
            const startTime = Date.now();
            for (let i = 1; i <= 1000; i++) {
                tree.add(i);
            }
            const endTime = Date.now();
            
            expect(tree.size()).to.equal(1000);
            expect(tree.isAVLBalanced()).to.be.true;
            expect(endTime - startTime).to.be.at.most(100); // Should complete in under 100ms
        });

        it('should handle large number of searches efficiently', function() {
            for (let i = 1; i <= 1000; i++) {
                tree.add(i);
            }
            
            const startTime = Date.now();
            for (let i = 1; i <= 100; i++) {
                tree.find(i);
            }
            const endTime = Date.now();
            
            expect(endTime - startTime).to.be.at.most(50); // Should complete in under 50ms
        });

        it('should handle mixed operations efficiently', function() {
            const startTime = Date.now();
            
            // Insert 500 items
            for (let i = 1; i <= 500; i++) {
                tree.add(i);
            }
            
            // Remove 100 items
            for (let i = 1; i <= 100; i++) {
                tree.remove(i);
            }
            
            // Add 200 more items
            for (let i = 501; i <= 700; i++) {
                tree.add(i);
            }
            
            const endTime = Date.now();
            
            expect(tree.size()).to.equal(600);
            expect(tree.isAVLBalanced()).to.be.true;
            expect(endTime - startTime).to.be.at.most(100); // Should complete in under 100ms
        });
    });

    describe('Edge Cases', function() {
        it('should handle single item tree', function() {
            tree.add('apple');
            expect(tree.size()).to.equal(1);
            expect(tree.minimum()).to.equal('apple');
            expect(tree.maximum()).to.equal('apple');
            expect(tree.isAVLBalanced()).to.be.true;
        });

        it('should handle two item tree', function() {
            tree.add('banana');
            tree.add('apple');
            expect(tree.size()).to.equal(2);
            expect(tree.minimum()).to.equal('apple');
            expect(tree.maximum()).to.equal('banana');
            expect(tree.isAVLBalanced()).to.be.true;
        });

        it('should handle duplicate keys', function() {
            tree.add('apple');
            tree.add('apple');
            expect(tree.size()).to.equal(2);
            expect(tree.find('apple')).to.equal('apple'); // Should return first occurrence
        });

        it('should handle empty search results', function() {
            tree.add('apple');
            expect(tree.find('banana')).to.deep.equal([]);
            expect(tree.findAll('banana')).to.deep.equal([]);
        });

        it('should handle complex object structures', function() {
            const complexItems = [
                { id: 1, data: { name: 'apple', metadata: { color: 'red' } } },
                { id: 2, data: { name: 'banana', metadata: { color: 'yellow' } } },
                { id: 3, data: { name: 'cherry', metadata: { color: 'red' } } }
            ];
            
            tree.init(complexItems);
            expect(tree.size()).to.equal(3);
            expect(tree.find(2)).to.deep.equal(complexItems[1]);
        });
    });
});
