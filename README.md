# TRAMIND 🧠

**Mental Training & Cognitive Enhancement Platform**

A comprehensive brain training application designed to improve reflexes, awareness, impulse control, and focus through gamified drills. Built with React 19, TypeScript, and the React Compiler for optimal performance.

![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?logo=vite)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎯 Features

### Core Training Drills
- **Reflex Drill (Click)** - Test and improve reaction time by clicking targets
- **Keyboard Reflex** - Press SPACEBAR as fast as possible when prompted
- **Awareness Drill** - Train peripheral vision by identifying targets among distractors
- **Impulse Control** - Build discipline by resisting urges and temptations
- **Focus Drill** - Maintain attention by tracking a moving target with your cursor

### Progression System
- **XP & Leveling** - Earn experience points and level up
- **Difficulty Scaling** - Drills adapt to your skill level
- **Streak Tracking** - Maintain daily training streaks with freeze days
- **Star Ratings** - Get 1-5 stars based on performance
- **Statistics** - Track your progress across all drills

### Design & UX
- **Dark/Light Mode** - Toggle between themes
- **Mobile Responsive** - Optimized for all screen sizes
- **Winter Arc Aesthetic** - Cold, focused, minimalist design
- **Smooth Animations** - Polished UI with React Compiler optimizations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/tramind.git
cd tramind

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
# Create optimized production build
pnpm build

# Preview production build
pnpm preview
```

## 📁 Project Structure

```
tramind/
├── src/
│   ├── components/
│   │   ├── dashboard/        # Main dashboard UI
│   │   ├── drills/           # All training drills
│   │   ├── progress/         # Progress tracking page
│   │   ├── ui/               # Reusable UI components
│   │   └── common/           # Shared components
│   ├── contexts/             # React contexts (GameContext)
│   ├── services/             # Business logic (scoring, storage, progression)
│   ├── types/                # TypeScript type definitions
│   ├── utils/                # Helper functions and constants
│   └── hooks/                # Custom React hooks
├── public/                   # Static assets
└── docs/                     # Documentation files
```

## 🎮 How to Use

1. **Start Training** - Choose a drill from the dashboard
2. **Complete Sessions** - Follow the drill instructions and complete rounds
3. **Track Progress** - View your stats and improvement over time
4. **Maintain Streaks** - Train daily to build and maintain streaks
5. **Level Up** - Earn XP to unlock higher difficulty levels

## 🛠️ Tech Stack

- **React 19.1.1** - UI library with React Compiler
- **TypeScript 5.9.3** - Type safety and better DX
- **Vite 7.1.7** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Local Storage API** - Data persistence
- **Lucide React** - Icon library

## 📊 Drill Details

### Reflex Drills
Test reaction time with visual and keyboard stimuli. Difficulty increases with smaller targets and faster requirements.

### Awareness Drill
Peripheral vision training with brief target displays. Track accuracy, hit rate, and reaction times.

### Impulse Control
Resist clicking a tempting button as an "urge bar" rises. Build mental discipline through timed resistance.

### Focus Drill
Maintain cursor within a moving target while avoiding distractions. Track focus percentage and streak length.

## 🔧 Configuration

### React Compiler
The React Compiler is enabled for automatic optimizations. See `vite.config.ts` for configuration.

### ESLint
Configured with TypeScript, React Hooks, and React Refresh rules. See `eslint.config.js`.

### Theme
Customize colors in `src/index.css` using CSS variables.

## 📝 Scripts

```bash
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm lint       # Run ESLint
pnpm preview    # Preview production build
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with React 19 and the React Compiler
- Inspired by the "Winter Arc" mindset of focused self-improvement
- Design philosophy: Minimalism, functionality, and cold aesthetics

## 📚 Documentation

For detailed implementation notes and development guide, see:
- [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) - Development roadmap and technical details
- [CLAUDE.md](CLAUDE.md) - Project instructions for AI assistants

## 🐛 Known Issues

See [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md#-known-issues--todos) for current known issues and planned improvements.

---

**Built with focus. Train with discipline. Level up your mind.**
