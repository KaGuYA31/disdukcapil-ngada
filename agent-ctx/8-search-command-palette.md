# Task 8: Search Command Palette

## Summary
Created a full-featured Search Command Palette (Cmd+K dialog) component with instant search results for the Disdukcapil Ngada website.

## Files Created
- `/home/z/my-project/src/components/shared/search-command.tsx` — Main "use client" component

## Files Modified
- `/home/z/my-project/src/components/layout/header.tsx` — Removed inline search bar, added `openSearchCommand()` that dispatches `open-search-command` custom event
- `/home/z/my-project/src/app/layout.tsx` — Added `<SearchCommand />` inside `<Providers>` wrapper after `{children}`

## Implementation Details

### SearchCommand Component
- **Trigger**: Opens on Cmd+K (Mac) / Ctrl+K (Windows) keyboard shortcut, and via custom event `open-search-command`
- **UI**: Full-screen overlay with `bg-black/50 backdrop-blur-sm` backdrop, centered `max-w-2xl` white container with `rounded-2xl shadow-2xl`
- **Animations**: framer-motion `AnimatePresence` with scale + opacity transitions for open/close
- **Search data**:
  - 10 static pages (Beranda, Profil, Layanan, etc.) with icons, descriptions, and categories (Halaman, Layanan, Berita)
  - Berita API results from `/api/berita?q={query}` with 300ms debounce (fetches when query >= 2 chars)
- **Keyboard navigation**: Arrow up/down to navigate, Enter to select, Escape to close
- **Result styling**: Active/hover state uses `bg-green-50 border-l-2 border-green-500`
- **Empty state**: Shows "Tidak ada hasil" with search icon when no matches found
- **Footer hints**: Shows keyboard shortcuts (↑↓ navigate, ↵ buka, esc menutup)
- **Default view**: When no query, shows 6 "Pintasan" (shortcuts) from static pages
- **Accessibility**: ARIA roles (`dialog`, `combobox`, `listbox`, `option`, `aria-activedescendant`), labels, keyboard navigation
- **Portal**: Uses `createPortal` to render at `document.body` level
- **Body scroll lock**: Prevents background scrolling when palette is open

### Header Changes
- Removed `isSearchOpen`, `searchQuery` state and `searchInputRef`
- Removed Cmd+K keyboard shortcut handler (now in SearchCommand)
- Removed `handleSearch` function
- Removed inline expandable search bar JSX
- Desktop search button now dispatches `open-search-command` event
- Mobile menu search area replaced with a styled button that also dispatches the event (shows ⌘K hint)
- Cleaned up unused imports (`useRef`, `Input`)

### Layout Changes
- Added `SearchCommand` import
- Added `<SearchCommand />` after `{children}` inside `<Providers>`
