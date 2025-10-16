// Export both modern and legacy versions for compatibility
const modernBTree = require('./lib/btree-modern');
const legacyBTree = require('./lib/btree');

module.exports = {
    // Modern ES6+ class
    BTree: modernBTree.BTree,
    createTree: modernBTree.createTree,
    
    // Legacy support
    legacy: legacyBTree,
    
    // Default export (modern)
    ...modernBTree
};