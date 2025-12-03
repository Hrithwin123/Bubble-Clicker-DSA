# 🎯 Aim Trainer Game - Data Structures in Action

A React-based aim training game that demonstrates **practical applications of Data Structures and Algorithms (DSA)** in a real-world gaming scenario. This project showcases how fundamental computer science concepts can be applied to create efficient, performant game mechanics.

---

## 🧠 Data Structures & Algorithms Implementation

This project is built around **three core data structures**, each solving specific game mechanics challenges:

### 1. **Stack - Life Management System** 📚
**File:** `src/utils/lifeStack.ts`

**Problem Solved:** Managing player lives with LIFO (Last In, First Out) behavior

**Implementation:**
- **Push**: Add lives when collecting life powerups (max 10)
- **Pop**: Remove lives when missing circles
- **Peek**: Check current life count without modification

**Why Stack?**
- Natural fit for life management (last life gained is first life lost)
- O(1) time complexity for all operations
- Memory efficient with fixed capacity

**Game Integration:**
```typescript
// Add life when collecting pink circle
lifeStack.push(1);

// Lose life when missing a circle
if (!lifeStack.isEmpty()) {
  lifeStack.pop();
}
```

---

### 2. **Queue - Powerup Management System** 🔄
**File:** `src/utils/powerupQueue.ts`

**Problem Solved:** Managing multiple powerups with FIFO (First In, First Out) behavior

**Implementation:**
- **Enqueue**: Add collected powerups to queue
- **Dequeue**: Activate next powerup when current expires
- **Front**: Check which powerup is currently active

**Why Queue?**
- Ensures fair powerup activation order (first collected, first activated)
- Prevents powerup conflicts (only one active at a time)
- O(1) time complexity for enqueue/dequeue operations
- Visual queue display shows upcoming powerups

**Game Integration:**
```typescript
// Collect powerup
if (activePowerup) {
  powerupQueue.enqueue('slowtime'); // Queue for later
} else {
  activatePowerup('slowtime'); // Use immediately
}

// When powerup expires
const next = powerupQueue.dequeue();
if (next) activatePowerup(next);
```

---

### 3. **Doubly Linked List - Leaderboard System** 🏆
**File:** `src/utils/leaderboardll.ts`

**Problem Solved:** Efficient sorted insertion and bidirectional traversal of leaderboard entries

**Implementation:**
- **Sorted Insertion**: O(n) insertion maintaining descending score order
- **Bidirectional Traversal**: Navigate forward/backward through rankings
- **Dynamic Size**: No fixed capacity, grows as needed
- **Efficient Updates**: Insert new scores without array reallocation

**Why Doubly Linked List?**
- **Efficient Insertion**: Insert scores in sorted position without shifting elements (unlike arrays)
- **Memory Efficient**: No pre-allocated space needed
- **Bidirectional Navigation**: Can traverse rankings in both directions
- **No Reallocation**: Unlike dynamic arrays, no costly resize operations

**Key Operations:**
```typescript
// O(n) sorted insertion - maintains descending order
insertSorted(name: string, score: number)

// O(n) load from backend data
loadFromArray(entries: Array<{name, score}>)

// O(n) get all entries
getLeaderBoard(): Array<{name, score}>

// O(1) add to start/end
addStart(name, score)
addEnd(name, score)
```

**Algorithm - Sorted Insertion:**
```typescript
1. If list empty → insert as first node
2. If score >= highest → insert at start
3. If score <= lowest → insert at end
4. Else → traverse to find correct position
5. Update prev/next pointers to maintain links
```

**Game Integration:**
```typescript
// Fetch from backend
const data = await fetchLeaderboard();
leaderboard.loadFromArray(data); // Convert to linked list

// New score achieved
leaderboard.insertSorted(playerName, score); // Maintains order

// Display rankings
const rankings = leaderboard.getLeaderBoard(); // O(n) traversal
```

---

## 🎮 Game Features

### Core Gameplay
- **Dynamic Scoring**: Smaller circles = higher points (10-100 points)
- **Lives System**: Start with 3 lives, max 10 (managed by Stack)
- **Time Challenge**: 60-second rounds
- **Powerup System**: Managed by Queue for fair activation

### Powerups
- 💗 **Life Boost** (Pink): +1 life
- 🕐 **Slow Time** (Blue): 20s of slower circle spawning
- ⚡ **Double Score** (Yellow): 15s of 2x points

### Visual Features
- **Glossy Bubble Effects**: 3D-styled circles with gradients
- **Particle Explosions**: 8-particle burst on click
- **Animated Powerup Bar**: Real-time progress indicators
- **Smooth Animations**: 60 FPS rendering

---

## 🏗️ Tech Stack

### Frontend
- **React 19** + **TypeScript** - Type-safe component architecture
- **Vite** - Lightning-fast build tool
- **TailwindCSS 4** - Utility-first styling
- **React Router** - Client-side routing
- **Custom DSA Implementations** - No external data structure libraries

### Backend
- **Node.js** + **Express** - RESTful API
- **MongoDB** + **Mongoose** - NoSQL database with ODM
- **JWT** - Stateless authentication
- **Bcrypt** - Password hashing

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd aim-trainer
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd back
npm install
```

4. **Configure environment variables**
```bash
# back/.env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=3000
```

5. **Start the backend**
```bash
cd back
npm run dev
```

6. **Start the frontend** (in new terminal)
```bash
npm run dev
```

7. **Open browser**
```
http://localhost:5173
```

---

## 📊 Performance Analysis

### Time Complexity

| Operation | Data Structure | Complexity | Justification |
|-----------|---------------|------------|---------------|
| Add Life | Stack | O(1) | Direct push to top |
| Remove Life | Stack | O(1) | Direct pop from top |
| Enqueue Powerup | Queue | O(1) | Add to rear |
| Dequeue Powerup | Queue | O(1) | Remove from front |
| Insert Score | Doubly LL | O(n) | Traverse to find position |
| Load Leaderboard | Doubly LL | O(n) | Iterate through all nodes |
| Display Rankings | Doubly LL | O(n) | Single traversal |

### Space Complexity

| Data Structure | Space | Notes |
|----------------|-------|-------|
| Stack | O(1) | Fixed capacity (10 lives) |
| Queue | O(k) | k = number of queued powerups |
| Doubly Linked List | O(n) | n = number of leaderboard entries |

---

## 🎯 DSA Learning Outcomes

### What You'll Learn

1. **Stack Applications**
   - LIFO principle in game state management
   - Capacity constraints and overflow handling
   - Real-time state updates

2. **Queue Applications**
   - FIFO ordering for fair resource allocation
   - Event scheduling and management
   - Visual queue representation

3. **Linked List Applications**
   - Dynamic memory allocation
   - Efficient sorted insertion
   - Bidirectional traversal
   - Pointer manipulation

4. **Algorithm Design**
   - Sorted insertion algorithm
   - State management patterns
   - Real-time data updates

---

## 📁 Project Structure

```
aim-trainer/
├── src/
│   ├── components/
│   │   ├── Bubble.tsx              # Bubble component with effects
│   │   ├── AuthModal.tsx           # Authentication UI
│   │   ├── SaveScoreModal.tsx      # Score submission
│   │   └── ParticleEffect.tsx      # Click particles
│   ├── pages/
│   │   ├── GamePage.tsx            # Main game logic
│   │   └── LeaderboardPage.tsx     # Rankings display
│   ├── utils/
│   │   ├── lifeStack.ts            # 📚 Stack Implementation
│   │   ├── powerupQueue.ts         # 🔄 Queue Implementation
│   │   ├── leaderboardll.ts        # 🏆 Doubly Linked List
│   │   ├── authApi.ts              # Auth utilities
│   │   └── leaderboardApi.ts       # API calls
│   └── App.tsx                     # Router setup
├── back/
│   ├── models/
│   │   ├── User.js                 # User schema
│   │   └── Leaderboard.js          # Score schema
│   ├── controllers/
│   │   ├── authController.js       # Auth logic
│   │   └── leaderboardController.js # Score logic
│   ├── routers/
│   │   ├── authRouter.js           # Auth routes
│   │   └── leaderboardRouter.js    # Score routes
│   └── index.js                    # Server entry
└── README.md
```

---

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login

### Leaderboard
- `GET /api/leaderboard?limit=50` - Fetch top scores
- `POST /api/leaderboard` - Submit score (guest or authenticated)

See `back/README.md` for detailed API documentation.

---

## 🎨 Visual Features

- **Glossy Bubbles**: Radial gradients for 3D effect
- **Glow Effects**: Pulsing animations for powerups
- **Particle System**: 8-particle explosion on click
- **Progress Bars**: Real-time powerup timers
- **Smooth Animations**: CSS-based 60 FPS animations

---

## 🤝 Contributing

This project is designed for educational purposes. Feel free to:
- Add new data structures (e.g., Priority Queue for powerup priorities)
- Implement new algorithms (e.g., Binary Search for leaderboard)
- Enhance game mechanics
- Improve UI/UX

---

## 📝 License

MIT License - Feel free to use this project for learning and teaching DSA concepts!

---

## 🎓 Educational Value

This project demonstrates:
- ✅ Practical DSA applications in game development
- ✅ Performance optimization through proper data structure selection
- ✅ Real-time state management
- ✅ Full-stack development with TypeScript
- ✅ Clean code architecture and separation of concerns

**Perfect for:** Computer Science students, coding bootcamp projects, DSA portfolio pieces, game development learning
