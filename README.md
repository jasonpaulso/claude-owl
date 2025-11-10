# Claude Owl 🦉

> A beautiful, open-source desktop UI for managing Claude Code configurations, settings, and features.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Beta](https://img.shields.io/badge/status-Beta-blue.svg)](#status)

**Status:** 🚀 Beta - Actively developed and tested on macOS (Windows support coming soon)

---

## What is Claude Owl?

Claude Owl is a desktop application for managing [Claude Code](https://code.claude.com) configurations through an intuitive visual interface. Instead of manually editing JSON and YAML configuration files in your text editor, Claude Owl provides:

- **Visual Settings Editor** - Configure environment variables, permissions, and core settings
- **Subagents Manager** - Create, edit, and manage custom agents with system prompts and tool access
- **Skills & Plugins Manager** - Browse and manage your agent skills and plugins
- **Debug Logs Viewer** - View detailed logs from Claude Code operations
- **Hooks Manager** - View and validate your configured hooks with security insights
- **Local-First** - All configurations stay on your machine with no external data collection

## Current Features (Beta)

Currently available and functional:

- **Dashboard** - Check your Claude Code installation status at a glance
- **Settings Editor** - Visual configuration of environment variables, permissions rules, and core settings
- **Subagents Manager** - Create, edit, and delete custom agents with system prompts and tool restrictions
- **Skills Manager** - Browse and manage available agent skills
- **Plugins Manager** - Browse and manage installed plugins
- **Debug Logs** - View detailed debug logs from Claude Code operations
- **Hooks Manager** - View, validate, and test hooks with security insights

See [SCREENSHOTS.md](SCREENSHOTS.md) for feature screenshots.

![Claude Owl Dashboard](screenshots/dashboard.png)

## Installation

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Claude Code CLI** ([installation guide](https://code.claude.com/docs/en/quickstart))
- **macOS** (currently tested and supported; Windows/Linux support in development)

### Install from Source

Claude Owl is currently in Beta and available for development/testing:

```bash
# Clone the repository
git clone https://github.com/yourusername/claude-owl.git
cd claude-owl

# Install dependencies
npm install

# Run in development mode
npm run dev:electron
```

### Build for Production

```bash
npm run build
npm run package
```

Pre-built binaries for macOS are coming soon.

## Documentation

- [Architecture Overview](docs/architecture.md) - System design and technical details
- [Contributing Guide](CONTRIBUTING.md) - How to contribute
- [Code of Conduct](CODE_OF_CONDUCT.md) - Community guidelines
- [Development Notes](CLAUDE.md) - Development commands and project structure

## Development

### Project Structure

```
claude-owl/
├── src/
│   ├── main/           # Electron main process (Node.js)
│   ├── renderer/       # React frontend UI
│   ├── preload/        # Preload scripts (IPC bridge)
│   └── shared/         # Shared code (types, utils)
├── tests/              # Test files
├── docs/               # Documentation
└── public/             # Static assets
```

### Tech Stack

- **Desktop Framework**: Electron
- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **Styling**: Tailwind CSS + shadcn/ui
- **Testing**: Vitest + React Testing Library

### Development Scripts

See [CLAUDE.md](CLAUDE.md) for the complete list of development commands.

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

To get started:

```bash
# Fork and clone the repository
git clone https://github.com/yourusername/claude-owl.git
cd claude-owl

# Install dependencies
npm install

# Start development server
npm run dev:electron
```

## Development Status

Currently in **Beta** with core features available on macOS.

**Completed:**
- ✅ Foundation and project setup
- ✅ Claude Code detection
- ✅ Subagents manager (create, edit, delete)
- ✅ Skills and plugins manager
- ✅ Settings editor with permissions rules
- ✅ Debug logs viewer
- ✅ Hooks manager (read-only with templates and validation)

**Next:**
- Commands manager
- MCP servers manager
- Windows/Linux support

## Architecture

Claude Owl uses a layered architecture:

```
┌─────────────────────────────────────────┐
│         React Frontend (Renderer)       │
│  Components • State • UI Logic          │
└─────────────────────────────────────────┘
                    ↕ IPC
┌─────────────────────────────────────────┐
│      Electron Main Process (Backend)    │
│  Services • File Operations • CLI       │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│         Claude Code CLI & Configs       │
│  ~/.claude/ • .claude/ • claude CLI     │
└─────────────────────────────────────────┘
```

See [architecture.md](docs/architecture.md) for detailed diagrams and design decisions.

## Screenshots

See [SCREENSHOTS.md](SCREENSHOTS.md) for feature screenshots and UI walkthroughs.

## FAQ

### Does Claude Owl replace Claude Code?

No, Claude Owl is a UI companion for Claude Code. It manages configurations visually but still uses the Claude Code CLI under the hood.

### Is my data safe?

Yes! Claude Owl is completely local-first. All configurations and data stay on your machine. No data is sent to external servers, and no telemetry is collected.

### Can I use Claude Owl with my team?

Yes! Project-level configurations (`.claude/`) can be committed to git and shared with your team. Team features are planned for future releases.

### What platforms are currently supported?

- **macOS** (Intel & Apple Silicon) - ✅ 
- **Windows** - In development
- **Linux** - In development

### How can I contribute?

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## License

Claude Owl is open-source software licensed under the [MIT License](LICENSE).

## Acknowledgments

- Built for the [Claude Code](https://code.claude.com) community
- Inspired by the need for better developer tools
- Special thanks to all contributors

## Support

- 📖 [Documentation](docs/)
- 💬 [Discussions](https://github.com/yourusername/claude-owl/discussions)
- 🐛 [Issue Tracker](https://github.com/yourusername/claude-owl/issues)

---
