const expect = require('chai').expect;
const { BTree } = require('../lib/btree');

describe('AVL Tree Balancing', function() {
    let tree;

    beforeEach(function() {
        tree = new BTree();
    });

    describe('Rotation Operations', function() {
        it('should perform right rotation for left-left case', function() {
            // Create a left-heavy tree that needs right rotation
            tree.add(3);
            tree.add(2);
            tree.add(1);
            
            expect(tree.isAVLBalanced()).to.be.true;
            expect(tree.getHeight()).to.equal(2);
            expect(tree.getBalanceFactor()).to.be.at.least(-1);
            expect(tree.getBalanceFactor()).to.be.at.most(1);
        });

        it('should perform left rotation for right-right case', function() {
            // Create a right-heavy tree that needs left rotation
            tree.add(1);
            tree.add(2);
            tree.add(3);
            
            expect(tree.isAVLBalanced()).to.be.true;
            expect(tree.getHeight()).to.equal(2);
            expect(tree.getBalanceFactor()).to.be.at.least(-1);
            expect(tree.getBalanceFactor()).to.be.at.most(1);
        });

        it('should perform left-right rotation for left-right case', function() {
            // Create a tree that needs left-right rotation
            tree.add(3);
            tree.add(1);
            tree.add(2);
            
            expect(tree.isAVLBalanced()).to.be.true;
            expect(tree.getHeight()).to.equal(2);
            expect(tree.getBalanceFactor()).to.be.at.least(-1);
            expect(tree.getBalanceFactor()).to.be.at.most(1);
        });

        it('should perform right-left rotation for right-left case', function() {
            // Create a tree that needs right-left rotation
            tree.add(1);
            tree.add(3);
            tree.add(2);
            
            expect(tree.isAVLBalanced()).to.be.true;
            expect(tree.getHeight()).to.equal(2);
            expect(tree.getBalanceFactor()).to.be.at.least(-1);
            expect(tree.getBalanceFactor()).to.be.at.most(1);
        });
    });

    describe('Height Maintenance', function() {
        it('should maintain correct heights after insertions', function() {
            for (let i = 1; i <= 7; i++) {
                tree.add(i);
                expect(tree.isAVLBalanced()).to.be.true;
            }
            
            expect(tree.getHeight()).to.equal(3); // log2(7) ≈ 2.8, so height = 3
        });

        it('should maintain correct heights after deletions', function() {
            // Insert 15 items
            for (let i = 1; i <= 15; i++) {
                tree.add(i);
            }
            
            const initialHeight = tree.getHeight();
            expect(tree.isAVLBalanced()).to.be.true;
            
            // Remove items and check height maintenance
            tree.remove(8);
            expect(tree.isAVLBalanced()).to.be.true;
            expect(tree.getHeight()).to.be.at.most(initialHeight);
            
            tree.remove(4);
            expect(tree.isAVLBalanced()).to.be.true;
            expect(tree.getHeight()).to.be.at.most(initialHeight);
        });

        it('should have optimal height for perfect binary tree size', function() {
            // Insert items to create a perfect binary tree size (2^n - 1)
            for (let i = 1; i <= 15; i++) { // 2^4 - 1 = 15
                tree.add(i);
            }
            
            expect(tree.getHeight()).to.equal(4); // Perfect height for 15 items
            expect(tree.isAVLBalanced()).to.be.true;
        });
    });

    describe('Balance Factor Validation', function() {
        it('should maintain balance factor within [-1, 1] range', function() {
            for (let i = 1; i <= 100; i++) {
                tree.add(i);
                const balanceFactor = tree.getBalanceFactor();
                expect(balanceFactor).to.be.at.least(-1);
                expect(balanceFactor).to.be.at.most(1);
            }
        });

        it('should maintain balance factor after deletions', function() {
            // Insert 50 items
            for (let i = 1; i <= 50; i++) {
                tree.add(i);
            }
            
            // Remove items and check balance factor
            for (let i = 1; i <= 25; i++) {
                tree.remove(i);
                const balanceFactor = tree.getBalanceFactor();
                expect(balanceFactor).to.be.at.least(-1);
                expect(balanceFactor).to.be.at.most(1);
            }
        });
    });

    describe('Worst Case Scenarios', function() {
        it('should handle sequential insertions (worst case for BST)', function() {
            const startTime = Date.now();
            
            for (let i = 1; i <= 1000; i++) {
                tree.add(i);
            }
            
            const endTime = Date.now();
            
            expect(tree.isAVLBalanced()).to.be.true;
            expect(tree.getHeight()).to.be.at.most(12); // log2(1000) ≈ 9.97, but AVL can be slightly higher
            expect(endTime - startTime).to.be.at.most(100); // Should be fast
        });

        it('should handle reverse sequential insertions', function() {
            const startTime = Date.now();
            
            for (let i = 1000; i >= 1; i--) {
                tree.add(i);
            }
            
            const endTime = Date.now();
            
            expect(tree.isAVLBalanced()).to.be.true;
            expect(tree.getHeight()).to.be.at.most(12);
            expect(endTime - startTime).to.be.at.most(100);
        });

        it('should handle alternating insertions', function() {
            // Insert in alternating pattern: 1, 1000, 2, 999, 3, 998, ...
            for (let i = 1; i <= 500; i++) {
                tree.add(i);
                tree.add(1001 - i);
            }
            
            expect(tree.isAVLBalanced()).to.be.true;
            expect(tree.getHeight()).to.be.at.most(12);
        });
    });

    describe('Complex Operations', function() {
        it('should maintain balance during mixed operations', function() {
            // Insert 100 items
            for (let i = 1; i <= 100; i++) {
                tree.add(i);
            }
            
            expect(tree.isAVLBalanced()).to.be.true;
            const initialHeight = tree.getHeight();
            
            // Remove every 3rd item
            for (let i = 3; i <= 99; i += 3) {
                tree.remove(i);
                expect(tree.isAVLBalanced()).to.be.true;
            }
            
            // Add 50 more items
            for (let i = 101; i <= 150; i++) {
                tree.add(i);
                expect(tree.isAVLBalanced()).to.be.true;
            }
            
            expect(tree.getHeight()).to.be.at.most(initialHeight + 2);
        });

        it.skip('should handle rapid insertions and deletions', function() {
            // Add some initial items
            for (let i = 1; i <= 100; i++) {
                tree.add(i);
            }
            
            // Perform rapid operations
            for (let i = 0; i < 500; i++) {
                const operation = Math.random();
                const value = Math.floor(Math.random() * 200) + 1;
                
                if (operation < 0.6) {
                    // 60% chance of insertion
                    tree.add(value);
                } else {
                    // 40% chance of deletion
                    try {
                        tree.remove(value);
                    } catch (error) {
                        // Ignore errors for non-existing items
                    }
                }
            }
            
            // Final balance check
            expect(tree.isAVLBalanced()).to.be.true;
        });
    });

    describe('Performance Characteristics', function() {
        it('should have logarithmic height growth', function() {
            const sizes = [10, 100, 1000, 10000];
            const heights = [];
            
            for (const size of sizes) {
                const testTree = new BTree();
                for (let i = 1; i <= size; i++) {
                    testTree.add(i);
                }
                heights.push(testTree.getHeight());
            }
            
            // Heights should grow logarithmically
            for (let i = 1; i < heights.length; i++) {
                const heightIncrease = heights[i] - heights[i-1];
                expect(heightIncrease).to.be.at.most(4); // Should not increase by more than 4 levels
            }
        });

        it('should maintain consistent performance across operations', function() {
            const iterations = 1000;
            const times = [];
            
            for (let i = 0; i < iterations; i++) {
                const startTime = process.hrtime.bigint();
                tree.add(i);
                const endTime = process.hrtime.bigint();
                times.push(Number(endTime - startTime));
            }
            
            // Calculate statistics
            const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
            const maxTime = Math.max(...times);
            
            // Performance should be consistent (low variance)
            expect(maxTime).to.be.at.most(avgTime * 50); // Max should not be more than 50x average
        });
    });
});
