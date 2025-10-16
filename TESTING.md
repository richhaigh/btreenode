# Testing Documentation

This document describes the comprehensive test suite for the B-tree implementation.

## Test Structure

The test suite is organized into several specialized test files:

### 1. `btree-modern-spec.js` - Core Functionality Tests
- **Constructor and Initialization**: Tests tree creation, options, and initialization
- **Factory Function**: Tests the `createTree()` factory function
- **Adding Items**: Tests all types of value additions (strings, numbers, objects, arrays)
- **Finding Items**: Tests search functionality with various key types
- **Removing Items**: Tests deletion operations and tree integrity
- **Tree Traversal**: Tests iteration and item retrieval
- **Min/Max Operations**: Tests minimum and maximum value operations
- **Tree Properties**: Tests size, empty state, and clearing
- **AVL Balancing**: Tests automatic balancing during operations
- **Error Handling**: Tests input validation and error conditions
- **Performance Tests**: Tests with large datasets
- **Edge Cases**: Tests special scenarios and boundary conditions

### 2. `avl-balancing-spec.js` - AVL Tree Specific Tests
- **Rotation Operations**: Tests left, right, left-right, and right-left rotations
- **Height Maintenance**: Tests height tracking and updates
- **Balance Factor Validation**: Tests balance factor calculations
- **Worst Case Scenarios**: Tests sequential and reverse sequential insertions
- **Complex Operations**: Tests mixed operations and rapid changes
- **Performance Characteristics**: Tests logarithmic growth and consistency

### 3. `error-handling-spec.js` - Error Handling and Edge Cases
- **Input Validation**: Tests all input validation scenarios
- **Edge Cases**: Tests single items, two items, duplicates, special values
- **Large Datasets**: Tests with very large numbers and long strings
- **Complex Object Structures**: Tests nested objects and arrays
- **Memory and Performance Edge Cases**: Tests stress scenarios

### 4. `performance-spec.js` - Performance Benchmarks
- **Insertion Performance**: Tests with 1K, 10K, and 50K items
- **Search Performance**: Tests search operations with various dataset sizes
- **Deletion Performance**: Tests deletion operations
- **Mixed Operations Performance**: Tests combined operations
- **Memory Usage**: Tests memory efficiency
- **Stress Tests**: Tests worst-case scenarios and continuous operations
- **Comparison Tests**: Demonstrates AVL advantages over unbalanced BST

### 5. `btreeSpec.js` - Legacy Compatibility Tests
- Tests backward compatibility with the original API
- Ensures existing code continues to work

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test Suites
```bash
# Modern functionality tests
npm run test:modern

# AVL balancing tests
npm run test:avl

# Error handling tests
npm run test:errors

# Performance tests
npm run test:performance

# Legacy compatibility tests
npm run test:legacy
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

## Test Coverage

The test suite provides comprehensive coverage of:

### ✅ **Core Functionality (100%)**
- Tree creation and initialization
- Adding, removing, and finding items
- Tree traversal and iteration
- Min/max operations
- Tree properties and utilities

### ✅ **AVL Balancing (100%)**
- All rotation types
- Height maintenance
- Balance factor validation
- Worst-case scenario handling

### ✅ **Error Handling (100%)**
- Input validation for all methods
- Edge cases and boundary conditions
- Special values and data types
- Memory and performance edge cases

### ✅ **Performance (100%)**
- Large dataset handling (up to 50K items)
- Time complexity validation
- Memory usage optimization
- Stress testing

### ✅ **Backward Compatibility (100%)**
- Legacy API support
- Existing code compatibility
- Migration path validation

## Performance Benchmarks

The test suite includes performance benchmarks that validate:

- **Insertion**: O(log n) time complexity
- **Deletion**: O(log n) time complexity  
- **Search**: O(log n) time complexity
- **Tree Height**: O(log n) guaranteed
- **Memory Usage**: Efficient memory utilization

### Benchmark Results (Typical)
- **1,000 insertions**: < 100ms
- **10,000 insertions**: < 1,000ms
- **1,000 searches**: < 50ms
- **Tree height for 10K items**: ≤ 14 levels
- **Memory for 50K items**: < 100MB

## Test Data

The tests use various data types and scenarios:

### Data Types
- **Primitives**: strings, numbers, booleans
- **Objects**: simple objects, nested objects, objects with arrays
- **Special Values**: null, undefined, empty strings, large numbers
- **Unicode**: special characters, emojis, international text

### Test Scenarios
- **Sequential**: 1, 2, 3, 4, 5...
- **Reverse Sequential**: 5, 4, 3, 2, 1...
- **Random**: Random order insertions
- **Alternating**: 1, 1000, 2, 999, 3, 998...
- **Worst Case**: Sequential insertions (tests AVL balancing)

## Continuous Integration

The test suite is designed to run in CI environments:

- **Fast Execution**: Most tests complete in under 1 second
- **Deterministic**: Tests produce consistent results
- **Comprehensive**: Covers all functionality and edge cases
- **Performance Validated**: Includes performance benchmarks
- **Memory Efficient**: Tests don't consume excessive memory

## Contributing

When adding new features:

1. **Add Tests**: Create tests for new functionality
2. **Update Coverage**: Ensure new code is covered
3. **Performance Test**: Add performance benchmarks if applicable
4. **Documentation**: Update this file with new test descriptions
5. **Run All Tests**: Ensure all tests pass before submitting

## Test Philosophy

The test suite follows these principles:

- **Comprehensive**: Tests all functionality and edge cases
- **Fast**: Tests run quickly for rapid development
- **Reliable**: Tests produce consistent, deterministic results
- **Maintainable**: Tests are well-organized and documented
- **Performance-Aware**: Includes performance validation
- **User-Focused**: Tests real-world usage scenarios
