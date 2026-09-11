# CYBER//TUNE

Offline-first personal music player foundation.

## Phase 1
- Responsive Home / Library / Search shell
- Local-only import entry point
- Persistent-looking playback shell with a single application state
- Mobile bottom navigation and desktop sidebar
- Reduced-motion support
- No remote music services

## Architecture direction
`src/` will be split into UI, state, audio engine, IndexedDB library, metadata, search, playlists and utilities as implementation grows.

## Current limitation
Phase 1 accepts local audio files into transient application state and derives basic filename metadata. IndexedDB persistence, real playback, embedded metadata/artwork and organization are intentionally reserved for later phases.
