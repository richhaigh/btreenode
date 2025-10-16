const expect = require('chai').expect;
const { BTree, createTree } = require('../lib/btree');

describe('Error Handling and Edge Cases', function() {
    let tree;

    beforeEach(function() {
        tree = new BTree();
    });

    describe('Input Validation', function() {
        describe('init() method', function() {
            it('should throw error for non-array values', function() {
                expect(() => tree.init('not an array')).to.throw('Values must be an array');
                expect(() => tree.init(123)).to.throw('Values must be an array');
                expect(() => tree.init({})).to.throw('Values must be an array');
                expect(() => tree.init(null)).to.throw('Values must be an array');
            });

            it('should throw error for invalid options', function() {
                expect(() => tree.init([], 'invalid')).to.throw('Options must be an object');
                expect(() => tree.init([], 123)).to.throw('Options must be an object');
            });

            it('should throw error for invalid key option', function() {
                expect(() => tree.init([], { key: 123 })).to.throw('Key option must be a string');
                expect(() => tree.init([], { key: null })).to.throw('Key option must be a string');
            });

            it('should handle empty array', function() {
                expect(() => tree.init([])).to.not.throw();
                expect(tree.isEmpty()).to.be.true;
            });

            it('should handle null/undefined values in array', function() {
                expect(() => tree.init([null])).to.throw('Value cannot be undefined or null');
                expect(() => tree.init([undefined])).to.throw('Value cannot be undefined or null');
            });
        });

        describe('add() method', function() {
            it('should throw error for null/undefined values', function() {
                expect(() => tree.add(null)).to.throw('Value cannot be undefined or null');
                expect(() => tree.add(undefined)).to.throw('Value cannot be undefined or null');
            });

            it('should throw error for invalid key type', function() {
                expect(() => tree.add('value', {})).to.throw('Key must be a string or number');
                expect(() => tree.add('value', [])).to.throw('Key must be a string or number');
                expect(() => tree.add('value', null)).to.throw('Key must be a string or number');
            });

            it('should throw error for object without required key', function() {
                expect(() => tree.add({ name: 'apple' })).to.throw("Object must have property 'id'");
                expect(() => tree.add({ id: null })).to.throw("Object property 'id' cannot be undefined or null");
                expect(() => tree.add({ id: undefined })).to.throw("Object property 'id' cannot be undefined or null");
            });

            it('should throw error for array items without required key', function() {
                const items = [
                    { id: 1, name: 'apple' },
                    { name: 'banana' }, // Missing id
                    { id: 3, name: 'cherry' }
                ];
                expect(() => tree.add(items)).to.throw("Array item at index 1 must have property 'id'");
            });

            it('should throw error for unsupported value types', function() {
                expect(() => tree.add(function() {})).to.throw('Unsupported value type: function');
                expect(() => tree.add(Symbol('test'))).to.throw('Unsupported value type: symbol');
            });
        });

        describe('remove() method', function() {
            it('should throw error for null/undefined keys', function() {
                expect(() => tree.remove(null)).to.throw('Key cannot be undefined or null');
                expect(() => tree.remove(undefined)).to.throw('Key cannot be undefined or null');
            });

            it('should throw error for removing from empty tree', function() {
                expect(() => tree.remove('anything')).to.throw('Cannot remove from empty tree');
            });

            it('should throw error for non-existing keys', function() {
                tree.add('apple');
                expect(() => tree.remove('banana')).to.throw("Key 'banana' not found in tree");
            });
        });

        describe('find() method', function() {
            it('should throw error for null/undefined keys', function() {
                expect(() => tree.find(null)).to.throw('Key cannot be undefined or null');
                expect(() => tree.find(undefined)).to.throw('Key cannot be undefined or null');
            });

            it('should throw error for empty search object', function() {
                expect(() => tree.find({})).to.throw('Search object must have at least one property');
            });
        });

        describe('forEach() method', function() {
            it('should throw error for non-function callbacks', function() {
                expect(() => tree.forEach('not a function')).to.throw('Callback must be a function');
                expect(() => tree.forEach(123)).to.throw('Callback must be a function');
                expect(() => tree.forEach({})).to.throw('Callback must be a function');
                expect(() => tree.forEach(null)).to.throw('Callback must be a function');
            });
        });

        describe('min/max methods', function() {
            it('should throw error for minimum on empty tree', function() {
                expect(() => tree.minimum()).to.throw('Cannot find minimum in empty tree');
                expect(() => tree.getMinimumNode()).to.throw('Cannot find minimum in empty tree');
            });

            it('should throw error for maximum on empty tree', function() {
                expect(() => tree.maximum()).to.throw('Cannot find maximum in empty tree');
                expect(() => tree.getMaximumNode()).to.throw('Cannot find maximum in empty tree');
            });
        });
    });

    describe('Edge Cases', function() {
        describe('Single item operations', function() {
            it('should handle single item tree correctly', function() {
                tree.add('apple');
                
                expect(tree.size()).to.equal(1);
                expect(tree.isEmpty()).to.be.false;
                expect(tree.minimum()).to.equal('apple');
                expect(tree.maximum()).to.equal('apple');
                expect(tree.find('apple')).to.equal('apple');
                expect(tree.isAVLBalanced()).to.be.true;
            });

            it('should handle removing the only item', function() {
                tree.add('apple');
                tree.remove('apple');
                
                expect(tree.isEmpty()).to.be.true;
                expect(tree.size()).to.equal(0);
                expect(tree.isAVLBalanced()).to.be.true;
            });
        });

        describe('Two item operations', function() {
            it('should handle two item tree correctly', function() {
                tree.add('banana');
                tree.add('apple');
                
                expect(tree.size()).to.equal(2);
                expect(tree.minimum()).to.equal('apple');
                expect(tree.maximum()).to.equal('banana');
                expect(tree.isAVLBalanced()).to.be.true;
            });

            it('should handle removing one of two items', function() {
                tree.add('banana');
                tree.add('apple');
                tree.remove('banana');
                
                expect(tree.size()).to.equal(1);
                expect(tree.minimum()).to.equal('apple');
                expect(tree.maximum()).to.equal('apple');
                expect(tree.isAVLBalanced()).to.be.true;
            });
        });

        describe('Duplicate keys', function() {
            it('should handle duplicate string keys', function() {
                tree.add('apple');
                tree.add('apple');
                
                expect(tree.size()).to.equal(2);
                expect(tree.find('apple')).to.equal('apple');
                expect(tree.findAll('apple')).to.have.length(2);
            });

            it('should handle duplicate number keys', function() {
                tree.add(42);
                tree.add(42);
                
                expect(tree.size()).to.equal(2);
                expect(tree.find(42)).to.equal(42);
                expect(tree.findAll(42)).to.have.length(2);
            });

            it('should handle duplicate object keys', function() {
                const item1 = { id: 1, name: 'apple' };
                const item2 = { id: 1, name: 'banana' };
                
                tree.add(item1);
                tree.add(item2);
                
                expect(tree.size()).to.equal(2);
                expect(tree.find(1)).to.deep.equal(item1);
                expect(tree.findAll(1)).to.have.length(2);
            });
        });

        describe('Special values', function() {
            it('should handle zero values', function() {
                tree.add(0);
                expect(tree.find(0)).to.equal(0);
                expect(tree.minimum()).to.equal(0);
                expect(tree.maximum()).to.equal(0);
            });

            it('should handle negative numbers', function() {
                tree.add(-1);
                tree.add(-2);
                tree.add(1);
                
                expect(tree.minimum()).to.equal(-2);
                expect(tree.maximum()).to.equal(1);
                expect(tree.isAVLBalanced()).to.be.true;
            });

            it('should handle empty strings', function() {
                tree.add('');
                tree.add('a');
                
                expect(tree.minimum()).to.equal('');
                expect(tree.maximum()).to.equal('a');
                expect(tree.isAVLBalanced()).to.be.true;
            });

            it('should handle special characters in strings', function() {
                const specialStrings = ['!@#$%', '🚀', 'ñáéíóú', '中文'];
                
                for (const str of specialStrings) {
                    tree.add(str);
                }
                
                expect(tree.size()).to.equal(specialStrings.length);
                expect(tree.isAVLBalanced()).to.be.true;
            });
        });

        describe('Large datasets', function() {
            it('should handle very large numbers', function() {
                const largeNumbers = [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER, 0];
                
                for (const num of largeNumbers) {
                    tree.add(num);
                }
                
                expect(tree.size()).to.equal(3);
                expect(tree.minimum()).to.equal(Number.MIN_SAFE_INTEGER);
                expect(tree.maximum()).to.equal(Number.MAX_SAFE_INTEGER);
                expect(tree.isAVLBalanced()).to.be.true;
            });

            it('should handle very long strings', function() {
                const longString = 'a'.repeat(10000);
                tree.add(longString);
                
                expect(tree.find(longString)).to.equal(longString);
                expect(tree.isAVLBalanced()).to.be.true;
            });
        });

        describe('Complex object structures', function() {
            it('should handle nested objects', function() {
                const complexObject = {
                    id: 1,
                    data: {
                        nested: {
                            deeply: {
                                value: 'test'
                            }
                        }
                    }
                };
                
                tree.add(complexObject);
                expect(tree.find(1)).to.deep.equal(complexObject);
            });

            it('should handle objects with arrays', function() {
                const objectWithArray = {
                    id: 1,
                    items: [1, 2, 3, 4, 5]
                };
                
                tree.add(objectWithArray);
                expect(tree.find(1)).to.deep.equal(objectWithArray);
            });

            it('should handle objects with functions', function() {
                const objectWithFunction = {
                    id: 1,
                    method: function() { return 'test'; }
                };
                
                tree.add(objectWithFunction);
                expect(tree.find(1)).to.deep.equal(objectWithFunction);
            });
        });
    });

    describe('Memory and Performance Edge Cases', function() {
        it('should handle rapid clear and rebuild operations', function() {
            for (let i = 0; i < 100; i++) {
                // Add items
                for (let j = 1; j <= 10; j++) {
                    tree.add(j);
                }
                
                // Clear and verify
                tree.clear();
                expect(tree.isEmpty()).to.be.true;
                expect(tree.size()).to.equal(0);
            }
        });

        it('should handle alternating add/remove operations', function() {
            for (let i = 1; i <= 1000; i++) {
                tree.add(i);
                if (i % 2 === 0) {
                    tree.remove(i);
                }
            }
            
            expect(tree.size()).to.equal(500);
            expect(tree.isAVLBalanced()).to.be.true;
        });

        it('should handle stress test with random operations', function() {
            const operations = 10000;
            let expectedSize = 0;
            
            for (let i = 0; i < operations; i++) {
                const operation = Math.random();
                const value = Math.floor(Math.random() * 1000);
                
                if (operation < 0.6) {
                    // 60% chance of add
                    try {
                        tree.add(value);
                        expectedSize++;
                    } catch (error) {
                        // Ignore errors
                    }
                } else {
                    // 40% chance of remove
                    try {
                        tree.remove(value);
                        if (tree.find(value) !== undefined) {
                            expectedSize--;
                        }
                    } catch (error) {
                        // Ignore errors
                    }
                }
                
                // Check balance every 100 operations
                if (i % 100 === 0) {
                    expect(tree.isAVLBalanced()).to.be.true;
                }
            }
            
            expect(tree.isAVLBalanced()).to.be.true;
        });
    });
});
