var expect = require('chai').expect,
	btree = require('../lib/btree');

var tree = new btree.createTree();

describe('btree', function() {
	describe('#init', function() {

		it("should initialise a tree with an empty items array", function() {

			var tree = new btree.createTree();
			tree.init();

			var expected = [];
			expect(tree).to.have.a.property('initialised').to.be.true;
			expect(tree.items()).to.be.empty;
		});

		it("should initialise a tree with the given items sorted in ascending order", function() {

			var tree = new btree.createTree();
			tree.init(['apple', 'orange', 'pear', 'banana']);
			var items = tree.items();

			expect(tree).to.have.a.property('initialised').to.be.true;
			expect(tree.items()).to.have.length(4);
			expect(items[0]).eql('apple');
			expect(items[1]).eql('banana');
			expect(items[2]).eql('orange');
			expect(items[3]).eql('pear');
		});

		it('should initialise a tree with the given items sorted by the supplied key name', function() {

			tree = new btree.createTree();
			tree.init([{
				type: 'fruit',
				id: 1,
				name: 'apple'
			}, {
				type: 'fruit',
				id: 1,
				name: 'orange'
			}, {
				type: 'fruit',
				id: 1,
				name: 'pear'
			}, {
				type: 'fruit',
				id: 1,
				name: 'banana'
			}], {
				key: 'name'
			});

			expect(tree).to.have.a.property('initialised').to.be.true;
			expect(tree.items()).to.have.length(4);
			expect(tree.items()[0]).to.have.property('name', 'apple');
			expect(tree.items()[1]).to.have.property('name', 'banana');
			expect(tree.items()[2]).to.have.property('name', 'orange');
			expect(tree.items()[3]).to.have.property('name', 'pear');

		});
	});

	describe('#add', function() {

		before(function() {
			tree = new btree.createTree();
			tree.init(['apple', 'orange', 'pear', 'banana']);
		});

		it('should add a new item to the tree and sort', function() {

			tree.add('melon');

			expect(tree).to.have.property('initialised').to.be.true;
			expect(tree.items()).to.have.length(5);
			expect(tree.items()[2]).eql('melon');
		});

	});
	describe('#remove', function() {
		beforeEach(function() {
			tree = new btree.createTree();
			tree.init([{
				type: 'fruit',
				id: 1,
				name: 'apple'
			}, {
				type: 'fruit',
				id: 2,
				name: 'orange'
			}, {
				type: 'fruit',
				id: 3,
				name: 'pear'
			}, {
				type: 'fruit',
				id: 4,
				name: 'banana'
			}], {
				key: 'name'
			});
			tree.balance();
		});

		it('should remove a specified item from the tree', function() {
			tree.remove('banana');

			expect(tree.items()).to.have.length(3);
			expect(tree.items()).to.not.include({
				type: 'fruit',
				id: 4,
				name: 'banana'
			});
			expect(tree.items()[0]).to.have.property('name', 'apple');
			expect(tree.items()[1]).to.have.property('name', 'orange');
			expect(tree.items()[2]).to.have.property('name', 'pear');
		});

		it('should remove the first item from the tree', function() {
			tree.remove('apple');

			expect(tree.items()).to.have.length(3);
			expect(tree.items()).to.not.include({
				type: 'fruit',
				id: 1,
				name: 'apple'
			});
			//expect(tree).to.have.property('items').to.have.members(['banana', 'orange', 'pear']);
		});

		it('should remove the last item from the tree', function() {
			tree.remove('pear');

			expect(tree.items()).to.have.length(3);
			expect(tree.items()).to.not.include({
				type: 'fruit',
				id: 3,
				name: 'pear'
			});
			//expect(tree).to.have.property('items').to.have.members(['apple', 'banana', 'orange']);
		});

		it('should remove the root item from the tree', function() {
			tree.remove('banana');

			expect(tree.items()).to.have.length(3);
			expect(tree.items()).to.not.include({
				type: 'fruit',
				id: 4,
				name: 'banana'
			});
			//expect(tree).to.have.property('items').to.have.members(['apple', 'banana', 'orange']);
		});

		it('should not remove item from tree that does not exists', function() {
			tree.remove('potato');

			expect(tree.items()).to.have.length(4);
			expect(tree.items()).to.not.include('potato');
			//expect(tree).to.have.property('items').to.have.members(['apple', 'banana', 'orange']);
		});

	});

	describe('#findOne', function() {
		before(function() {
			tree = new btree.createTree();
			tree.init([{
				type: 'fruit',
				id: 1,
				name: 'apple'
			}, {
				type: 'fruit',
				id: 2,
				name: 'orange'
			}, {
				type: 'fruit',
				id: 3,
				name: 'pear'
			}, {
				type: 'fruit',
				id: 4,
				name: 'banana'
			}], {
				key: 'name'
			});
		});
		it('should find one item where key equals', function() {

			var result = tree.find('pear');

			expect(result).to.have.length(1);
			expect(result[0]).to.have.property('name', 'pear');

			result = tree.find('banana');
			expect(result).to.have.length(1);
			expect(result[0]).to.have.property('name', 'banana');
		});

		it('should find one item where name equals', function() {

			var result = tree.find({
				name: 'pear'
			});

			expect(result).to.have.length(1);
			expect(result[0]).to.have.property('name', 'pear');

			result = tree.find({
				name: 'banana'
			});
			expect(result).to.have.length(1);
			expect(result[0]).to.have.property('name', 'banana');
		});

		it('should find one item where id equals', function() {

			var result = tree.find({
				id: 2
			});
			expect(result).to.have.length(1);
			expect(result[0]).to.have.property('name', 'orange');

			result = tree.find({
				id: 1
			});
			expect(result).to.have.length(1);
			expect(result[0]).to.have.property('name', 'apple');
		});

		it('should not find items matching name', function() {

			var result = tree.find({
				name: 'potato'
			});
			expect(result).to.have.length(0);
		});

		it('should not find items matching id', function() {

			var result = tree.find({
				id: 99
			});
			expect(result).to.have.length(0);
		});
	});

	describe('#find', function() {
		before(function() {
			tree = new btree.createTree();
			tree.init([{
				type: 'fruit',
				id: 1,
				name: 'apple',
				color: 'red'
			}, {
				type: 'fruit',
				id: 2,
				name: 'orange',
				color: 'orange'
			}, {
				type: 'fruit',
				id: 3,
				name: 'pear',
				color: 'green'
			}, {
				type: 'fruit',
				id: 4,
				name: 'banana',
				color: 'yellow'
			}, {
				type: 'vegetable',
				id: 5,
				name: 'potato',
				color: 'brown'
			}, {
				type: 'vegetable',
				id: 6,
				name: 'carrot',
				color: 'orange'
			}, {
				type: 'vegetable',
				id: 7,
				name: 'onion',
				color: 'white'
			}], {
				key: 'type'
			});
			tree.balance();
		});

		it('should return all items matching the query', function() {

			var results = tree.find({
				type: 'vegetable'
			});
			expect(results).to.have.length(3);
			
			results = tree.find({
				type: 'fruit'
			});
			expect(results).to.have.length(4);
		});
	});
});
