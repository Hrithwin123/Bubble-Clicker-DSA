# Binary Search Tree Implementation - Leaderboard System

## Why BST for Leaderboards?

### Problems with Previous Approaches

#### Array-Based Leaderboard:
```typescript
// O(n) insertion - need to shift elements
scores = [1000, 950, 800, 750];
insertScore(900); // Need to shift 800, 750 → expensive!
```

#### Linked List Leaderboard:
```typescript
// O(n) insertion - need to traverse to find position
insertSorted(900); // Must traverse: 1000 → 950 → 800 → insert here
```

#### BST Leaderboard:
```typescript
// O(log n) insertion - binary search to find position
addPerson("Alice", 900); // Compare with root, go left/right → fast!
```

---

## BST Advantages for Gaming

### 1. **Fast Insertions** - O(log n)
Perfect for real-time score updates during gameplay:

```typescript
// Player finishes game with score 850
leaderboard.addPerson("Player123", 850);
// Only needs ~log₂(1000) = 10 comparisons for 1000 players!
```

### 2. **Automatic Sorting**
No need to manually maintain order:

```typescript
// BST Property: left < root < right
//     500
//    /   \
//  300   750
//  /     /  \
// 200  600  900

// Reverse in-order traversal gives: 900, 750, 600, 500, 300, 200
// Perfect descending order for leaderboards! 🏆
```

### 3. **Fast Lookups** - O(log n)
Quick rank checking and score validation:

```typescript
// Check if player beat high score
const currentHigh = leaderboard.getMaxScore(); // O(log n)

// Find specific score
const playerEntry = leaderboard.findScore(850); // O(log n)

// Get top 10 players
const topTen = leaderboard.getTopScores(10); // O(n) but only traverse needed nodes
```

---

## Implementation Details

### Node Structure

```typescript
class TreeNode {
    name: string;      // Player name
    score: number;     // Player score (key for BST)
    left: TreeNode | null;   // Lower scores
    right: TreeNode | null;  // Higher scores
}
```

### Core Operations

#### 1. Insertion Algorithm

```typescript
addPerson(name: string, score: number) {
    // Step 1: Create new node
    const newNode = new TreeNode(name, score);
    
    // Step 2: Handle empty tree
    if (root === null) {
        root = newNode;
        return;
    }
    
    // Step 3: Find insertion position
    let current = root;
    let parent = null;
    
    while (current !== null) {
        parent = current;
        if (score < current.score) {
            current = current.left;    // Go left for lower scores
        } else {
            current = current.right;   // Go right for higher scores
        }
    }
    
    // Step 4: Insert as leaf
    if (score < parent.score) {
        parent.left = newNode;
    } else {
        parent.right = newNode;
    }
}
```

**Time Complexity:**
- **Average Case**: O(log n) - balanced tree
- **Worst Case**: O(n) - degenerate tree (becomes linked list)

#### 2. Traversal for Leaderboard Display

```typescript
// Reverse In-Order: Right → Root → Left
reverseInOrder(node, result) {
    if (node === null) return;
    
    // 1. Visit right subtree (higher scores first)
    reverseInOrder(node.right, result);
    
    // 2. Process current node
    result.push({ name: node.name, score: node.score });
    
    // 3. Visit left subtree (lower scores)
    reverseInOrder(node.left, result);
}
```

**Why Reverse In-Order?**
- Normal in-order: Left → Root → Right = Ascending order
- Reverse in-order: Right → Root → Left = Descending order
- Perfect for leaderboards (highest scores first)!

---

## Visual Example: Building a Leaderboard BST

### Scenario: Players finish games and submit scores

```
Step 1: First player scores 500
Tree: [500]

Step 2: Player scores 750 (750 > 500, go right)
Tree:     500
            \
           750

Step 3: Player scores 300 (300 < 500, go left)
Tree:     500
         /   \
       300   750

Step 4: Player scores 900 (500→750→right of 750)
Tree:     500
         /   \
       300   750
               \
               900

Step 5: Player scores 200 (500→300→left of 300)
Tree:     500
         /   \
       300   750
      /       \
    200       900

Step 6: Player scores 600 (500→750→left of 750)
Tree:     500
         /   \
       300   750
      /     /   \
    200   600   900
```

### Leaderboard Display (Reverse In-Order):

```
Traversal Path: 900 → 750 → 600 → 500 → 300 → 200

Leaderboard:
🥇 1st: 900 points
🥈 2nd: 750 points  
🥉 3rd: 600 points
   4th: 500 points
   5th: 300 points
   6th: 200 points
```

---

## Performance Analysis

### Time Complexity Comparison

| Operation | Array | Linked List | BST (Avg) | BST (Worst) |
|-----------|-------|-------------|-----------|-------------|
| Insert | O(n) | O(n) | O(log n) | O(n) |
| Search | O(log n)* | O(n) | O(log n) | O(n) |
| Get Max | O(1)** | O(1)** | O(log n) | O(n) |
| Display All | O(n) | O(n) | O(n) | O(n) |

*Sorted array with binary search  
**If maintaining sorted order

### Space Complexity

| Data Structure | Space | Notes |
|----------------|-------|-------|
| Array | O(n) | Contiguous memory |
| Linked List | O(n) | Extra pointer overhead |
| BST | O(n) | Two pointers per node |

### Real-World Performance

**For 1000 players:**
- Array insertion: ~500 operations (shifting)
- Linked List insertion: ~500 operations (traversal)
- BST insertion: ~10 operations (log₂(1000))

**BST is 50x faster for insertions!** 🚀

---

## Handling Edge Cases

### 1. Duplicate Scores

```typescript
// Current implementation: allows duplicates by going right
if (score < current.score) {
    current = current.left;
} else {  // score >= current.score
    current = current.right;  // Duplicates go right
}
```

**Alternative approaches:**
- Store array of players with same score
- Use timestamp as tiebreaker
- Increment score slightly (850.001, 850.002...)

### 2. Unbalanced Trees

**Problem:** Sequential insertions create degenerate tree
```
Scores inserted in order: 100, 200, 300, 400, 500

Degenerate Tree:    100
                      \
                     200
                       \
                      300
                        \
                       400
                         \
                        500

Performance: O(n) - same as linked list! 😱
```

**Solutions:**
1. **Self-Balancing Trees**: AVL, Red-Black trees
2. **Random Insertion Order**: Shuffle scores before building
3. **Periodic Rebalancing**: Rebuild tree occasionally

### 3. Memory Management

```typescript
// Good practice: Clear references when removing nodes
removeNode(score) {
    // ... removal logic ...
    nodeToRemove.left = null;
    nodeToRemove.right = null;  // Help garbage collector
}
```

---

## Game-Specific Optimizations

### 1. Top-N Queries

```typescript
// Get top 10 without full traversal
getTopScores(n: number) {
    const result = [];
    this.reverseInOrderLimited(this.root, result, n);
    return result;
}

reverseInOrderLimited(node, result, limit) {
    if (node === null || result.length >= limit) return;
    
    this.reverseInOrderLimited(node.right, result, limit);
    if (result.length < limit) {
        result.push({name: node.name, score: node.score});
    }
    this.reverseInOrderLimited(node.left, result, limit);
}
```

### 2. Score Range Queries

```typescript
// Find all scores between min and max
getScoresInRange(minScore, maxScore) {
    const result = [];
    this.rangeQuery(this.root, minScore, maxScore, result);
    return result;
}

rangeQuery(node, min, max, result) {
    if (node === null) return;
    
    if (node.score >= min && node.score <= max) {
        result.push({name: node.name, score: node.score});
    }
    
    if (node.score > min) {
        this.rangeQuery(node.left, min, max, result);
    }
    
    if (node.score < max) {
        this.rangeQuery(node.right, min, max, result);
    }
}
```

### 3. Rank Calculation

```typescript
// Find player's rank (1-indexed)
getPlayerRank(targetScore) {
    let rank = 1;
    this.calculateRank(this.root, targetScore, rank);
    return rank;
}

calculateRank(node, targetScore, rank) {
    if (node === null) return rank;
    
    if (node.score > targetScore) {
        // All nodes in right subtree have higher scores
        rank += this.getSubtreeSize(node.right) + 1;
        return this.calculateRank(node.left, targetScore, rank);
    } else {
        return this.calculateRank(node.right, targetScore, rank);
    }
}
```

---

## Testing the BST

```typescript
// Test basic operations
const leaderboard = new LeaderBoard();

// Insert players
leaderboard.addPerson("Alice", 850);
leaderboard.addPerson("Bob", 920);
leaderboard.addPerson("Charlie", 780);
leaderboard.addPerson("Diana", 950);

// Get leaderboard
console.log(leaderboard.getLeaderBoard());
// Output: [
//   { name: "Diana", score: 950 },
//   { name: "Bob", score: 920 },
//   { name: "Alice", score: 850 },
//   { name: "Charlie", score: 780 }
// ]

// Test searches
console.log(leaderboard.findScore(920)); // Bob's node
console.log(leaderboard.getMaxScore()); // Diana: 950
console.log(leaderboard.getMinScore()); // Charlie: 780

// Test top scores
console.log(leaderboard.getTopScores(2)); // Diana and Bob
```

---

## Conclusion

The BST implementation provides significant advantages for the leaderboard system:

### ✅ **Performance Benefits**
- **50x faster insertions** compared to arrays/linked lists
- **Logarithmic search** for quick lookups
- **Automatic sorting** without manual maintenance

### ✅ **Game-Specific Features**
- **Real-time updates** during gameplay
- **Efficient top-N queries** for display
- **Range queries** for score analysis
- **Rank calculation** for player feedback

### ✅ **Scalability**
- **Handles thousands of players** efficiently
- **Graceful performance degradation**
- **Memory efficient** with reasonable overhead

### ✅ **Educational Value**
- **Demonstrates tree algorithms** in practice
- **Shows performance trade-offs** between data structures
- **Real-world application** of computer science concepts

The BST leaderboard system perfectly balances performance, functionality, and educational value - making it ideal for both gaming and learning! 🎮📚