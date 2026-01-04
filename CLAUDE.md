# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Digital Desktop is a high-fidelity Windows 11 desktop experience built with Next.js, featuring integrated AI tools and productivity applications. The project simulates a complete desktop OS with draggable windows, taskbar, start menu, and multiple built-in applications.

## Development Commands

```bash
# Development
npm run dev                    # Start Next.js dev server at http://localhost:3000
npm run build                  # Build production bundle
npm run start                  # Start production server
npm run lint                   # Run ESLint

# Utility Scripts
npm run parse-project          # Parse project structure (ts-node required)
npm run upload-project         # Upload project data to Supabase
```

## Architecture Overview

### Core Layer Structure

The application follows a strict layering approach with z-index management:

1. **Desktop Layer** (`z-0`): Background wallpaper and desktop icons with drag-and-drop
2. **Window Layer** (`z-10+`): Managed windows with dynamic z-index based on focus
3. **Taskbar Layer** (top-level): Always visible at bottom of screen

All layers are positioned absolutely within the main container (`src/app/page.tsx:7-19`).

### State Management Pattern

**Centralized Zustand Store** (`src/lib/store/desktopStore.ts`):
- Single source of truth for desktop icons, windows, and taskbar state
- Windows are tracked in an array with properties: `id`, `appId`, `title`, `zIndex`, `isMinimized`, `isMaximized`, `position`, `size`
- Window lifecycle: `openWindow()` checks for existing window by `appId` before creating new instance
- Z-index management: Focused window gets `maxZ + 1`, ensuring proper stacking

**Key Store Actions**:
- `openWindow(appId, title)` - Focuses existing or creates new window
- `focusWindow(id)` - Brings window to front, updates z-index
- `closeWindow(id)` - Removes from windows array
- `minimizeWindow(id)` - Sets `isMinimized: true` (hides from DOM)
- `maximizeWindow(id)` - Toggles `isMaximized` state

### Window System

**WindowManager** (`src/components/os/Window/WindowManager.tsx`):
- Uses `react-rnd` for drag/resize functionality
- Maps `windows` array to rendered `<Rnd>` components
- Filters out minimized windows from rendering
- Custom resize handles with Windows 11-style blue highlights (defined in `globals.css`)
- Drag handle uses className `drag-handle` for title bar dragging

**App Registration** (`src/components/os/Window/WindowManager.tsx:137-152`):
- Apps registered via if/else chain based on `window.appId`
- Each app component receives `windowId` prop
- Current apps: `claude`, `chatgpt`, `cursor`, `antigravity`, `notion`
- Apps with custom title bars: Set `hideTitleBar={true}` in WindowFrame

### Desktop Icon System

Icons use grid-based positioning (`x`, `y` coordinates) with drag-and-drop via `@dnd-kit`:
- Icon data stored in `desktopStore.icons` array
- `DesktopGrid` component (`src/components/os/Desktop/`) renders icons
- Icons link to apps via `appId` property
- Double-click icon → calls `openWindow(icon.appId, icon.title)`

### API Routes Architecture

**API Route Pattern** (`src/app/api/`):
- Next.js App Router API routes (Route Handlers)
- Grouped by service: `/api/claude/*`, `/api/chatgpt/*`, `/api/notion/*`
- Standard response format: `{ success: boolean, data?: any, error?: string, configured?: boolean }`
- Configuration checks: APIs check for env vars, return `configured: false` if missing

**Notion API** (`src/app/api/notion/`):
- `/pages` - GET all accessible pages
- `/databases` - GET all databases
- `/blocks/[pageId]` - GET page content blocks
- Uses official Notion client (`@notionhq/client`)

**Claude/ChatGPT APIs**:
- CRUD operations for conversations, messages, artifacts
- Backed by Supabase (optional - apps work with mock data if unconfigured)

### Environment Configuration

**Required Env Vars** (see `.env.local.example`):
```bash
# Supabase (optional - apps use mock data if not configured)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=           # Server-side only

# Notion (optional - required for Notion app)
NOTION_API_KEY=                 # For multi-page Notion app
NOTION_TOKEN=                   # Legacy single-page (optional)
NOTION_ROOT_PAGE_ID=           # Legacy single-page (optional)
```

**Graceful Degradation Pattern**:
- Apps check configuration via exported `isConfigured` flags (`src/lib/supabase/client.ts:7`, etc.)
- If unconfigured, apps fall back to built-in mock data
- Example: `useShowcaseProject` hook uses default file tree if Supabase fails

## Key Patterns and Conventions

### TypeScript Path Aliases
- Use `@/*` for all imports from `src/`: `import { useDesktopStore } from '@/lib/store/desktopStore'`

### Component Prop Pattern for Apps
All app components receive a `windowId` prop:
```typescript
interface AppProps {
  windowId: string;
}

export const MyApp: React.FC<AppProps> = ({ windowId }) => {
  // Access window state if needed
  const { windows } = useDesktopStore();
  const window = windows.find(w => w.id === windowId);
  // ...
}
```

### Styling Conventions
- Tailwind CSS for all styling
- Global styles in `src/app/globals.css` for specialized needs:
  - `.window-resize-handle` - Custom resize handle styles
  - `.ide-scrollbar` - IDE-specific scrollbar styling
- Windows 11 design language: rounded corners, acrylic effects, blue accent colors

### Adding New Applications

1. **Create app component** in `src/components/apps/YourApp/`
2. **Add app registration** in `WindowManager.tsx:137-152`:
   ```typescript
   window.appId === 'your-app' ? (
     <YourApp windowId={window.id} />
   ) : ...
   ```
3. **Add desktop icon** to `desktopStore.ts` initial state (`icons` array)
4. **Add taskbar pin** (optional) to `pinnedApps` array
5. **Set `hideTitleBar`** if app has custom title bar

### Data Services Pattern

Services use a fallback pattern for unconfigured backends:

```typescript
// 1. Export configuration check
export const isServiceConfigured = !!(process.env.SERVICE_KEY);

// 2. Return mock data when unconfigured
export async function getData() {
  if (!isServiceConfigured) {
    return mockData;
  }
  // Real API call
}
```

Examples:
- `src/lib/supabase/client.ts` - Supabase client with null check
- `src/components/apps/AIIDE/useShowcaseProject.ts` - Full fallback pattern with defaults

## Testing and Development

- No test framework currently configured
- Use `npm run lint` to check for TypeScript/ESLint errors before committing
- Development workflow: Edit components → Auto-reload in browser → Check console for errors

## Important Notes

- **Window resize handles**: Custom CSS in `globals.css` creates Windows 11-style blue highlights on hover
- **Z-index management**: Window focus is critical - always use `focusWindow()` when interacting with windows
- **Supabase optional**: All apps designed to work without backend configuration
- **Icon paths**: Desktop icons use `/icons/` for local files or external URLs
- **TypeScript strict mode**: Enabled - all code must pass strict type checking
