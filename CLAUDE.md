# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Tramind** is a React + TypeScript + Vite project using React 19.1.1 with the React Compiler enabled. The project uses pnpm as the package manager.

## Commands

- **Development server**: `pnpm dev` - Starts Vite dev server with HMR
- **Build**: `pnpm build` - Runs TypeScript compiler followed by Vite build
- **Lint**: `pnpm lint` - Runs ESLint on the codebase
- **Preview**: `pnpm preview` - Preview production build locally

## Technology Stack

- **React 19.1.1** with React Compiler (babel-plugin-react-compiler)
- **TypeScript 5.9.3** with project references (tsconfig.app.json, tsconfig.node.json)
- **Vite 7.1.7** for build tooling
- **ESLint** with typescript-eslint, react-hooks, and react-refresh plugins

## Architecture Notes

### React Compiler
The React Compiler is enabled via Babel plugin in vite.config.ts. This impacts dev and build performance but provides automatic optimization of React components.

### TypeScript Configuration
The project uses TypeScript project references with separate configs:
- `tsconfig.json` - Root config referencing app and node configs
- `tsconfig.app.json` - Application code configuration
- `tsconfig.node.json` - Vite/Node tooling configuration

### ESLint Configuration
Uses the new flat config format (eslint.config.js) with:
- Recommended configs for JS and TypeScript
- React Hooks recommended-latest rules
- React Refresh rules for Vite HMR
- Global ignores for dist directory

## Project Structure

- `src/` - Application source code
  - `main.tsx` - Entry point with React 18+ createRoot API
  - `App.tsx` - Main application component
  - `assets/` - Static assets (images, etc.)
  - `*.css` - Component and global styles
- `public/` - Static public assets
- `dist/` - Build output (ignored by ESLint)
