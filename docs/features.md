# Claude Owl - v1.0 Feature List

**Version:** v1.0 Specification
**Status:** ✅ Implemented | 🚧 In Progress | ⏳ Planned

This document lists all features planned for Claude Owl v1.0. Features are organized by module and marked with implementation status.

---

## 1. Dashboard

### Overview Widgets ✅ **IMPLEMENTED**

✅ **Claude Code Status Card**
- Detects if Claude Code is installed
- Shows version number and installation path
- Links to installation guide if not found
- Color-coded status indicators

✅ **Service Status Feed**
- Real-time status from claude.com/status (RSS)
- Shows recent incidents and updates
- Auto-refresh every 5 minutes
- Expandable incident details

✅ **Quick Navigation**
- Cards for each module (Agents, Skills, Plugins, etc.)
- Visual icons and descriptions
- Click to navigate to module

### Quick Stats ⏳ **PLANNED v0.2**

- [ ] Total agents count (user/project/plugin breakdown)
- [ ] Total skills count
- [ ] Installed plugins count
- [ ] Active hooks count
- [ ] Recent sessions count (from ccusage)

### Recent Activity ⏳ **PLANNED v0.4**

- [ ] Last 10 Claude Code sessions
- [ ] Session timestamps and durations
- [ ] Success/error indicators
- [ ] Click to view session details

---

## 2. Settings Editor

### Settings Viewer ✅ **IMPLEMENTED**

✅ **Read-Only Display**
- View current settings.json (user/project)
- Syntax-highlighted JSON display
- Shows effective configuration (merged from all sources)

### Settings Editor ⏳ **PLANNED v0.2**

- [ ] **Editable Settings Interface**
  - Schema-driven form builder
  - Validation before save
  - Unsaved changes detection
  - Save to user or project settings.json

- [ ] **Permission Rules Builder**
  - Visual allow/ask/deny rule interface
  - Tool selector (Read, Write, Edit, Bash, etc.)
  - File path glob patterns (`*.env`, `.git/*`)
  - Bash command prefix matcher (`git`, `npm`)
  - Rule testing interface

- [ ] **Environment Variables Manager**
  - Key-value pair editor
  - Add/edit/delete variables
  - Import from .env file
  - Secure value masking for sensitive data
  - Export to .env format

- [ ] **Model Configuration**
  - Default model selector (Sonnet/Opus/Haiku)
  - Model override per project
  - Model parameters (temperature, max tokens)

- [ ] **Settings Hierarchy**
  - User settings tab (~/.claude/settings.json)
  - Project settings tab (.claude/settings.json)
  - Local settings tab (.claude/settings.local.json)
  - Effective settings view (merged)
  - Source indicator (which file overrides what)

### Settings Management ⏳ **PLANNED v0.2**

- [ ] **Save & Validation**
  - Real-time JSON schema validation
  - Error highlighting with fix suggestions
  - Backup before save (automatic)
  - Restore from backup

- [ ] **Import/Export**
  - Export settings to JSON/YAML
  - Import settings from file
  - Merge vs. replace option
  - Settings templates library

---

## 3. Agents Manager

### Agent Browser ✅ **IMPLEMENTED**

✅ **Agent List**
- Card view with agent name, description, model
- Filter by location (user/project/plugin)
- Filter by model (Sonnet/Opus/Haiku)
- Search by name/description

✅ **Agent Details**
- Agent name and description
- Model badge display
- Tools list (allowed tools)
- Location indicator (user/project/plugin)
- Last modified timestamp

### Agent Editor ✅ **IMPLEMENTED**

✅ **Create/Edit Interface**
- Agent name input (validation: lowercase-with-hyphens)
- Description textarea (max 1024 chars)
- Model selector dropdown
- Tools permission multi-select
- System prompt Markdown editor
- YAML frontmatter preview

✅ **Agent Operations**
- Create new agent (blank or from template)
- Edit existing agent
- Delete agent with confirmation
- Duplicate agent

### Agent Templates 🚧 **IN PROGRESS v0.3**

- [ ] **Template Library**
  - Built-in templates:
    - code-reviewer
    - debugger
    - test-writer
    - api-designer
    - documentation-writer
    - security-auditor
  - Template preview before creation
  - Template search and filter

- [ ] **Custom Templates**
  - Save agent as template
  - Edit custom templates
  - Delete custom templates
  - Template variables (${PROJECT_NAME}, etc.)

### Agent Import/Export ⏳ **PLANNED v0.3**

- [ ] Export single agent to .md file
- [ ] Export all agents as ZIP
- [ ] Import agent from .md file
- [ ] Import from URL (GitHub gist, etc.)
- [ ] Import from clipboard

---

## 4. Skills Manager

### Skills Browser ✅ **IMPLEMENTED**

✅ **Skills List**
- Card view with skill name and description
- Filter by location (user/project/plugin)
- Search by name/description
- View allowed tools

✅ **Skill Details**
- Skill name and description
- Allowed tools list
- Location indicator
- Supporting files count (if applicable)

### Skill Editor ⏳ **PLANNED v0.3**

- [ ] **SKILL.md Editor**
  - Frontmatter form (name, description, allowed-tools)
  - Markdown content editor for instructions
  - Live preview panel
  - Validation with inline errors

- [ ] **Supporting Files Manager**
  - File tree showing all skill files
  - Add new file (script, template, doc)
  - Add new folder
  - Upload files via drag-and-drop
  - Edit files in Monaco Editor
  - Delete files with confirmation

### Skill Operations ⏳ **PLANNED v0.3**

- [ ] Create new skill (blank or from template)
- [ ] Edit existing skill
- [ ] Delete skill with confirmation
- [ ] Duplicate skill
- [ ] Export skill with supporting files (ZIP)
- [ ] Import skill from ZIP

---

## 5. Plugins Manager

### Marketplace Browser ✅ **IMPLEMENTED**

✅ **Marketplace Selection**
- Marketplace dropdown selector
- Multiple marketplaces support
- Switch between marketplaces

✅ **Plugin Discovery**
- Plugin grid/list view
- Search plugins by name/description
- View plugin details (README, manifest)
- Plugin metadata (author, version, license)

✅ **Plugin Installation**
- Install button with confirmation
- Progress indicator (cloning, installing)
- Success/error notifications
- Post-install instructions display

### Installed Plugins ✅ **IMPLEMENTED**

✅ **Plugins List**
- All installed plugins view
- Plugin metadata display
- Installation date

### Plugin Management ⏳ **PLANNED v0.2**

- [ ] Enable/disable plugin toggle
- [ ] Uninstall plugin (delete files)
- [ ] View plugin components (commands, agents, skills)
- [ ] Plugin update checking
- [ ] Update single plugin
- [ ] Update all plugins

### Custom Marketplaces ⏳ **PLANNED v0.2**

- [ ] Add custom marketplace (name, URL, type)
- [ ] Edit marketplace
- [ ] Remove marketplace
- [ ] Marketplace validation

---

## 6. Commands Manager

### Commands Browser ⏳ **PLANNED v0.2**

- [ ] **Commands List**
  - Hierarchical view (namespaces/folders)
  - Flat list view with full names
  - Search by command name/description
  - Filter by location (user/project/plugin)

- [ ] **Command Cards**
  - Command name (/command-name)
  - Description
  - Argument hint
  - Location indicator

### Command Editor ⏳ **PLANNED v0.2**

- [ ] **Frontmatter Form**
  - Description input
  - Argument hint input
  - Allowed tools multi-select
  - Model override selector
  - Disable model invocation checkbox

- [ ] **Content Editor**
  - Markdown editor for command content
  - Syntax highlighting
  - Variable insertion ($ARGUMENTS, $1, $2)
  - File reference insertion (@file)
  - Bash script insertion (!command)

### Command Operations ⏳ **PLANNED v0.2**

- [ ] Create new command
- [ ] Edit existing command
- [ ] Delete command
- [ ] Duplicate command
- [ ] Move to namespace (change folder)
- [ ] Import/export commands

---

## 7. Hooks Manager

### Hooks Overview ✅ **IMPLEMENTED (Phase 1 - Read-Only)**

✅ **Hook Events Browser**
- List of all 8 hook events
- Security warning banner
- Active hooks count per event
- Event descriptions (when each triggers)
- "Learn More" links to docs

✅ **Hook Viewing**
- Read-only formatted JSON viewer
- Syntax highlighting
- Show matcher patterns
- Display hook type (command vs prompt)
- "Edit in settings.json" button (opens external editor)

✅ **Hook Templates**
- Template library gallery (5+ reviewed templates)
- Template descriptions and use cases
- Category badges (security/automation/logging)
- Security level indicators
- "Copy to Clipboard" functionality

✅ **Hook Validation**
- Parse and validate existing hooks
- Security checks (unquoted vars, dangerous commands, path traversal)
- Display validation results with security scores
- Fix suggestions for common issues
- Documentation on best practices

### Hook Editing ⏳ **PLANNED v0.3 (Phase 2)**

- [ ] **Template-Based Creation**
  - "Create from Template" workflow
  - Event selector dropdown
  - Template picker
  - Fill template variables
  - Preview generated JSON
  - Save to user/project settings

- [ ] **Visual Matcher Builder**
  - Tool selector (multi-select dropdown)
  - Support OR patterns
  - Wildcard option (* for all tools)
  - Regex pattern preview
  - Real-time validation
  - Test against tool list

- [ ] **Command Hook Editor**
  - Monaco Editor for bash scripts
  - Shell syntax highlighting
  - Variable helper buttons
  - Real-time security validation
  - Inline errors and fix suggestions
  - Required timeout configuration
  - Best practices tips panel

- [ ] **Hook Testing Preview**
  - Sample input panel
  - Show hook input JSON
  - Display command to be executed
  - Preview expected output
  - Decision flow diagram (PreToolUse)

- [ ] **Hook Management**
  - Enable/disable toggle per hook
  - Preserve configuration when disabled
  - "Disabled" badge display
  - Bulk enable/disable

---

## 8. MCP Servers Manager

### MCP Server List ⏳ **PLANNED v0.2**

- [ ] **Server Overview**
  - All configured servers list
  - Connection status indicator
  - Server type (stdio/HTTP)
  - Tools count per server
  - Enable/disable toggle

### MCP Configuration ⏳ **PLANNED v0.2**

- [ ] **Server Setup**
  - Server name input
  - Server type selector (stdio/HTTP)
  - Command/URL input
  - Arguments array editor (stdio)
  - Environment variables editor
  - Working directory input

- [ ] **.mcp.json Editor**
  - Visual form for .mcp.json
  - Raw JSON editor toggle
  - JSON validation
  - Schema IntelliSense

### MCP Tools & Testing ⏳ **PLANNED v0.2**

- [ ] **Tools Browser**
  - List all tools provided by server
  - Tool name and description
  - Tool schema (parameters, return type)

- [ ] **Connection Testing**
  - Test connection button
  - Connection diagnostics
  - Latency measurement
  - View server logs

---

## 9. Session Monitor

### Session History ✅ **IMPLEMENTED**

✅ **Sessions List (ccusage integration)**
- View all past sessions
- Session metadata (date, model)
- Basic session information

### Enhanced Session Monitoring ⏳ **PLANNED v0.4**

- [ ] **Session Browser**
  - Time range filter (today/week/month)
  - Search session content
  - Filter by status (success/error)
  - Filter by model
  - Sort options

- [ ] **Session Details**
  - Message-by-message view
  - User messages and Claude responses
  - Tool invocations expanded view
  - Token usage breakdown
  - Cost calculation

- [ ] **Active Sessions**
  - Currently running sessions
  - Real-time updates
  - Current operation display
  - Elapsed time
  - Stop session button

---

## 10. Debug Tools

### Log Viewer ⏳ **PLANNED v0.4**

- [ ] **Live Log Streaming**
  - Real-time log display (tail -f style)
  - Auto-scroll toggle
  - Log level filtering (error/warn/info/debug)
  - Log search with regex
  - Syntax highlighting
  - Copy logs to clipboard

- [ ] **Debug Logs Browser**
  - List all debug logs from ~/.claude/debug
  - File size and last modified
  - Select log file to view
  - Delete old logs

### Configuration Debugger ⏳ **PLANNED v0.4**

- [ ] **Effective Configuration**
  - View merged configuration from all sources
  - Highlight overrides (which setting from which file)
  - Configuration tree view
  - Search configuration keys

- [ ] **Configuration Diff**
  - Compare configurations between levels
  - Side-by-side diff viewer
  - Highlight conflicts
  - Copy setting from one level to another

---

## 11. Headless Test Runner

### Test Configuration ⏳ **PLANNED v0.4**

- [ ] **Test Builder**
  - Test name input
  - Prompt/input textarea
  - Model selector
  - Headless flags configurator (`-p`, `--allowedTools`, etc.)
  - Output format selector (text/JSON)
  - Expected output (for assertions)

### Test Execution ⏳ **PLANNED v0.4**

- [ ] **Execution Interface**
  - Run test button
  - Execution progress (elapsed time)
  - Real-time output streaming
  - Stop execution button
  - Execution status

- [ ] **Test Results**
  - Full output display (text/JSON)
  - Execution time
  - Token usage and cost
  - Pass/fail status
  - JSON pretty-print viewer

### Test Suite Management ⏳ **PLANNED v0.4**

- [ ] Create test suite (group of tests)
- [ ] Add tests to suite
- [ ] Run entire suite
- [ ] Suite progress display
- [ ] Suite summary (X passed, Y failed)
- [ ] Test history browser
- [ ] Trend analysis
- [ ] Export reports

---

## 12. Application Shell

### Window Management ✅ **IMPLEMENTED**

✅ **Main Application Window**
- Responsive layout
- Window state persistence (size, position)
- Minimum window size enforcement

✅ **Navigation**
- Left sidebar with icons
- Collapsible sidebar
- Active page highlighting

### Theme System ✅ **IMPLEMENTED**

✅ **Theme Support**
- Light mode
- Dark mode
- Auto theme (system preference)
- Theme persistence

### Keyboard Shortcuts ⏳ **PLANNED v0.4**

- [ ] Global shortcuts (Cmd+K quick switcher)
- [ ] Contextual shortcuts per module
- [ ] Shortcuts reference (Cmd+? overlay)
- [ ] Customizable key bindings

### Search & Navigation ⏳ **PLANNED v0.4**

- [ ] **Global Search**
  - Cmd+K quick switcher
  - Search across agents, skills, plugins, settings
  - Keyboard navigation of results
  - Recent searches history

- [ ] **Command Palette**
  - All actions accessible via palette
  - Keyboard shortcuts displayed
  - Fuzzy search for actions

---

## 13. Shared Components

### Code Editor ✅ **IMPLEMENTED**

✅ **Monaco Editor Integration**
- Syntax highlighting (JSON, YAML, Markdown, Bash)
- Line numbers
- Find and replace
- Auto-completion (IntelliSense)
- Error squiggles

### Validation ✅ **IMPLEMENTED**

✅ **Real-Time Validation**
- JSON schema validation
- YAML validation
- Inline error display
- Error summary panel

### Toast Notifications ✅ **IMPLEMENTED**

✅ **Notification System**
- Success/Error/Warning/Info types
- Auto-dismiss after timeout
- Manual dismiss button
- Notification queue

### File Operations ✅ **IMPLEMENTED**

✅ **File Management**
- Read Claude Code config files
- Parse YAML frontmatter
- Parse JSON/YAML configs
- File watching for changes

---

## 14. User Experience

### Accessibility ⏳ **PLANNED v0.4**

- [ ] **Keyboard Navigation**
  - Full keyboard access to all features
  - Tab navigation with focus indicators
  - Skip links to main content
  - Escape key to close modals

- [ ] **Screen Reader Support**
  - ARIA labels on interactive elements
  - ARIA live regions for dynamic content
  - Semantic HTML (headings, lists)
  - Screen reader testing (NVDA/VoiceOver)

- [ ] **Visual Accessibility**
  - High contrast mode
  - Sufficient contrast ratios (WCAG AA)
  - No color-only information
  - Reduced motion mode

### Onboarding ⏳ **PLANNED v0.5**

- [ ] **First-Run Wizard**
  - Welcome screen
  - Claude Code detection
  - Installation guide if not installed
  - Configuration setup wizard
  - Feature tour

### Help & Documentation ⏳ **PLANNED v0.5**

- [ ] **In-App Help**
  - Tooltips on form fields and buttons
  - Help icon (?) next to complex features
  - Contextual help panel
  - Links to Claude Code docs

- [ ] **Documentation**
  - Getting started guide
  - Feature documentation
  - FAQ section
  - Video tutorials

### Performance ⏳ **PLANNED v0.5**

- [ ] **Optimization**
  - Virtual scrolling for large lists (100+ items)
  - Code splitting by route
  - Lazy loading Monaco Editor
  - Debounced search/validation
  - Cache optimization

---

## 15. Platform-Specific Features

### macOS ✅ **IMPLEMENTED**

✅ **Native Integration**
- macOS menu bar
- Native file dialogs
- macOS notifications

### Windows ⏳ **PLANNED v1.0**

- [ ] Windows system tray
- [ ] Windows notifications
- [ ] Native file dialogs
- [ ] Windows Credential Manager for secrets

### Linux ⏳ **PLANNED v1.0**

- [ ] System tray integration
- [ ] D-Bus notifications
- [ ] Native file dialogs (GTK/Qt)
- [ ] Keyring integration

---

## 16. Build & Distribution

### Development ✅ **IMPLEMENTED**

✅ **Development Mode**
- Hot module replacement
- React DevTools integration
- TypeScript type checking
- ESLint and Prettier

### Building ⏳ **PLANNED v1.0**

- [ ] **Build Pipeline**
  - Vite build for renderer
  - TypeScript compilation for main/preload
  - electron-builder for packaging
  - Platform-specific builds (macOS/Windows/Linux)

- [ ] **Code Signing**
  - macOS developer certificate
  - Windows code signing
  - Signed builds tested

- [ ] **Auto-Update**
  - electron-updater integration
  - Update server configuration
  - Update flow tested
  - Rollback mechanism

---

## Summary

### v1.0 Feature Count

**✅ Implemented (v0.1):** ~25%
- Dashboard with Claude Code detection
- Agents browser/editor/operations
- Skills browser (basic)
- Plugins marketplace browser/install
- Hooks viewer/validation/templates (read-only)
- Sessions viewer (ccusage integration)
- Settings viewer (read-only)

**🚧 In Progress:** ~10%
- Agent templates
- Enhanced plugins management

**⏳ Planned for v1.0:** ~65%
- Settings editor (v0.2)
- Commands manager (v0.2)
- MCP servers manager (v0.2)
- Skills editor (v0.3)
- Hooks editor (v0.3)
- Session monitoring (v0.4)
- Test runner (v0.4)
- Accessibility (v0.4)
- Onboarding (v0.5)
- Build/distribution (v1.0)

### Priority Breakdown

**P0 (Critical for v1.0):** 80+ features
**P1 (Important for v1.0):** 60+ features
**P2 (Nice to have):** Deferred to v1.1+

### What's NOT in v1.0

See [future.md](./future.md) for post-v1.0 features:
- Git integration
- Cloud sync
- Team collaboration
- AI-powered suggestions
- Mobile companion app
- Free-form hook creation
- Prompt-based hooks
- Plugin development toolkit
- Advanced analytics

---

## User-Facing Benefits

**v1.0 will enable users to:**

1. ✅ **Manage Claude Code visually** instead of editing JSON/YAML by hand
2. ✅ **Browse and install plugins** from marketplaces with one click
3. ✅ **Create and edit agents** with templates and live preview
4. ✅ **View and validate hooks** with security warnings
5. ⏳ **Edit all settings** (permissions, environment, model config)
6. ⏳ **Manage slash commands** visually
7. ⏳ **Configure MCP servers** without touching .mcp.json
8. ⏳ **Create hooks safely** from templates with validation
9. ⏳ **Run headless tests** and track results
10. ⏳ **Monitor sessions** and view logs

**Key Value Proposition:**
Claude Owl makes Claude Code accessible to users who prefer visual tools over terminal commands, while maintaining power user capabilities for those who need them.
