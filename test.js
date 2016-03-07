var btree = require('./lib/btree');  

// Create a new tree
var tree = new btree.createTree();	

// Initialise a new tree using an array of values and specify a custom sort key
tree.init([
			{type: 'fruit',id: 1,name: 'apple'}, 
			{type: 'fruit', id: 2, name: 'orange'}, 
			{type: 'fruit', id: 5, name: 'pear'}, 
			{type: 'fruit', id: 4, name: 'banana'}
		], 
	{key: 'name'});

// Add a new item
tree.add({type: 'vegetable', id: 3, name: 'potato'});

// Remove an item
tree.remove('pear');

// Iterate through the tree
tree.forEach(function(value){
	console.log('I am a ', value.type, ' and my name is ', value.name);
});

// Check if the tree is balanced and balance it if not
if(!tree.isBalanced()){
	tree.balance();
}

// Get the minimum key value
var min = tree.minimum();

// Get the maximum key value
var max = tree.maximum();

// Find items by key value
var apple = tree.find('apple');

// Find items by any property
var banana = tree.find({id: 4});