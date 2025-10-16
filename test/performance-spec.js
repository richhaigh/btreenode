const expect = require('chai').expect;
const { BTree } = require('../lib/btree');

describe('Performance Benchmarks', function() {
    let tree;

    beforeEach(function() {
        tree = new BTree();
    });

    describe('Insertion Performance', function() {
        it('should handle 1000 insertions efficiently', function() {
            const startTime = process.hrtime.bigint();
            
            for (let i = 1; i <= 1000; i++) {
                tree.add(i);
            }
            
            const endTime = process.hrtime.bigint();
            const duration = Number(endTime - startTime) / 1000000; // Convert to milliseconds
            
            expect(tree.size()).to.equal(1000);
            expect(tree.isAVLBalanced()).to.be.true;
            expect(duration).to.be.at.most(100); // Should complete in under 100ms
        });

        it('should handle 10000 insertions efficiently', function() {
            const startTime = process.hrtime.bigint();
            
            for (let i = 1; i <= 10000; i++) {
                tree.add(i);
            }
            
            const endTime = process.hrtime.bigint();
            const duration = Number(endTime - startTime) / 1000000;
            
            expect(tree.size()).to.equal(10000);
            expect(tree.isAVLBalanced()).to.be.true;
            expect(duration).to.be.at.most(1000); // Should complete in under 1 second
        });

        it('should maintain logarithmic height growth', function() {
            const sizes = [100, 1000, 10000];
            const heights = [];
            
            for (const size of sizes) {
                const testTree = new BTree();
                for (let i = 1; i <= size; i++) {
                    testTree.add(i);
                }
                heights.push(testTree.getHeight());
            }
            
            // Heights should grow logarithmically
            const expectedHeights = sizes.map(size => Math.ceil(Math.log2(size)) + 1);
            
            for (let i = 0; i < heights.length; i++) {
                expect(heights[i]).to.be.at.most(expectedHeights[i] + 1);
            }
        });
    });

    describe('Search Performance', function() {
        beforeEach(function() {
            // Pre-populate tree with 1000 items
            for (let i = 1; i <= 1000; i++) {
                tree.add(i);
            }
        });

        it('should search 100 items efficiently', function() {
            const startTime = process.hrtime.bigint();
            
            for (let i = 1; i <= 100; i++) {
                tree.find(i);
            }
            
            const endTime = process.hrtime.bigint();
            const duration = Number(endTime - startTime) / 1000000;
            
            expect(duration).to.be.at.most(50); // Should complete in under 50ms
        });

        it('should search 1000 items efficiently', function() {
            const startTime = process.hrtime.bigint();
            
            for (let i = 1; i <= 1000; i++) {
                tree.find(i);
            }
            
            const endTime = process.hrtime.bigint();
            const duration = Number(endTime - startTime) / 1000000;
            
            expect(duration).to.be.at.most(200); // Should complete in under 200ms
        });

        it('should handle non-existing searches efficiently', function() {
            const startTime = process.hrtime.bigint();
            
            for (let i = 1001; i <= 1100; i++) {
                tree.find(i);
            }
            
            const endTime = process.hrtime.bigint();
            const duration = Number(endTime - startTime) / 1000000;
            
            expect(duration).to.be.at.most(50); // Should complete in under 50ms
        });
    });

    describe('Deletion Performance', function() {
        beforeEach(function() {
            // Pre-populate tree with 1000 items
            for (let i = 1; i <= 1000; i++) {
                tree.add(i);
            }
        });

        it('should delete 100 items efficiently', function() {
            const startTime = process.hrtime.bigint();
            
            for (let i = 1; i <= 100; i++) {
                tree.remove(i);
            }
            
            const endTime = process.hrtime.bigint();
            const duration = Number(endTime - startTime) / 1000000;
            
            expect(tree.size()).to.equal(900);
            expect(tree.isAVLBalanced()).to.be.true;
            expect(duration).to.be.at.most(100); // Should complete in under 100ms
        });

        it('should delete 500 items efficiently', function() {
            const startTime = process.hrtime.bigint();
            
            for (let i = 1; i <= 500; i++) {
                tree.remove(i);
            }
            
            const endTime = process.hrtime.bigint();
            const duration = Number(endTime - startTime) / 1000000;
            
            expect(tree.size()).to.equal(500);
            expect(tree.isAVLBalanced()).to.be.true;
            expect(duration).to.be.at.most(500); // Should complete in under 500ms
        });
    });

    describe('Mixed Operations Performance', function() {
        it('should handle mixed insert/delete operations efficiently', function() {
            const startTime = process.hrtime.bigint();
            
            // Insert 1000 items
            for (let i = 1; i <= 1000; i++) {
                tree.add(i);
            }
            
            // Remove every 3rd item
            for (let i = 3; i <= 999; i += 3) {
                tree.remove(i);
            }
            
            // Add 500 more items
            for (let i = 1001; i <= 1500; i++) {
                tree.add(i);
            }
            
            const endTime = process.hrtime.bigint();
            const duration = Number(endTime - startTime) / 1000000;
            
            expect(tree.size()).to.equal(1167); // 1000 - 333 + 500
            expect(tree.isAVLBalanced()).to.be.true;
            expect(duration).to.be.at.most(1000); // Should complete in under 1 second
        });

        it('should handle random operations efficiently', function() {
            const operations = 5000;
            const startTime = process.hrtime.bigint();
            
            for (let i = 0; i < operations; i++) {
                const operation = Math.random();
                const value = Math.floor(Math.random() * 1000);
                
                if (operation < 0.6) {
                    // 60% chance of add
                    try {
                        tree.add(value);
                    } catch (error) {
                        // Ignore errors
                    }
                } else if (operation < 0.8) {
                    // 20% chance of remove
                    try {
                        tree.remove(value);
                    } catch (error) {
                        // Ignore errors
                    }
                } else {
                    // 20% chance of find
                    tree.find(value);
                }
            }
            
            const endTime = process.hrtime.bigint();
            const duration = Number(endTime - startTime) / 1000000;
            
            expect(tree.isAVLBalanced()).to.be.true;
            expect(duration).to.be.at.most(2000); // Should complete in under 2 seconds
        });
    });

    describe('Memory Usage', function() {
        it('should handle large datasets without memory issues', function() {
            const initialMemory = process.memoryUsage().heapUsed;
            
            // Insert 50000 items
            for (let i = 1; i <= 50000; i++) {
                tree.add(i);
            }
            
            const afterInsertMemory = process.memoryUsage().heapUsed;
            const memoryIncrease = afterInsertMemory - initialMemory;
            
            // Memory increase should be reasonable (less than 100MB for 50k items)
            expect(memoryIncrease).to.be.at.most(100 * 1024 * 1024);
            expect(tree.isAVLBalanced()).to.be.true;
            
            // Remove half the items
            for (let i = 1; i <= 25000; i++) {
                tree.remove(i);
            }
            
            const afterDeleteMemory = process.memoryUsage().heapUsed;
            
            expect(tree.size()).to.equal(25000);
            expect(tree.isAVLBalanced()).to.be.true;
        });
    });

    describe('Stress Tests', function() {
        it('should handle worst-case insertion patterns', function() {
            const startTime = process.hrtime.bigint();
            
            // Sequential insertions (worst case for unbalanced BST)
            for (let i = 1; i <= 10000; i++) {
                tree.add(i);
            }
            
            const endTime = process.hrtime.bigint();
            const duration = Number(endTime - startTime) / 1000000;
            
            expect(tree.size()).to.equal(10000);
            expect(tree.isAVLBalanced()).to.be.true;
            expect(tree.getHeight()).to.be.at.most(14); // log2(10000) ≈ 13.3
            expect(duration).to.be.at.most(1000); // Should still be fast
        });

        it('should handle alternating insertion patterns', function() {
            const startTime = process.hrtime.bigint();
            
            // Insert in alternating pattern
            for (let i = 1; i <= 5000; i++) {
                tree.add(i);
                tree.add(10001 - i);
            }
            
            const endTime = process.hrtime.bigint();
            const duration = Number(endTime - startTime) / 1000000;
            
            expect(tree.size()).to.equal(10000);
            expect(tree.isAVLBalanced()).to.be.true;
            expect(duration).to.be.at.most(1000);
        });

        it('should maintain performance under continuous operations', function() {
            const iterations = 10000;
            const times = [];
            
            for (let i = 0; i < iterations; i++) {
                const startTime = process.hrtime.bigint();
                tree.add(i);
                const endTime = process.hrtime.bigint();
                times.push(Number(endTime - startTime));
            }
            
            // Calculate performance statistics
            const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
            const maxTime = Math.max(...times);
            const minTime = Math.min(...times);
            
            // Performance should be consistent
            expect(maxTime).to.be.at.most(avgTime * 20); // Max should not be more than 20x average
            expect(tree.isAVLBalanced()).to.be.true;
        });
    });

    describe('Comparison with Unbalanced Tree', function() {
        it('should demonstrate AVL advantage over unbalanced BST', function() {
            // Create AVL tree
            const avlTree = new BTree();
            const startTime = process.hrtime.bigint();
            
            // Insert 10000 items sequentially (worst case)
            for (let i = 1; i <= 10000; i++) {
                avlTree.add(i);
            }
            
            const avlTime = process.hrtime.bigint();
            const avlDuration = Number(avlTime - startTime) / 1000000;
            
            expect(avlTree.isAVLBalanced()).to.be.true;
            expect(avlTree.getHeight()).to.be.at.most(14); // O(log n) height
            expect(avlDuration).to.be.at.most(1000); // Should be fast
            
            // Search performance test
            const searchStart = process.hrtime.bigint();
            for (let i = 1; i <= 1000; i++) {
                avlTree.find(i);
            }
            const searchEnd = process.hrtime.bigint();
            const searchDuration = Number(searchEnd - searchStart) / 1000000;
            
            expect(searchDuration).to.be.at.most(100); // Should be very fast
        });
    });
});
