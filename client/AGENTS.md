# Project Agents Guide

This file explains how AI/code agents should work in this repository.

## Project Summary

- Next.js 13 e-commerce app (TypeScript, Tailwind CSS, Ant Design, Zustand)
- Frontend runs on port 4444; backend API on port 9000

## Local Development

- Install: pnpm install
- Dev: pnpm dev
- Build: pnpm build
- Start: pnpm start
- Lint: pnpm lint

## Architecture Notes

- Pages and routing are in src/pages
- Shared UI components are in src/components
- State management uses Zustand stores in src/hooks/storeSlices
- Axios clients live in src/libraries
- Types live in src/utils/types and src/utils/types2.ts

## Conventions

- Prefer existing patterns for Zustand stores (persist + immer)
- Use next/image for images; check domains in next.config.js
- Follow existing folder structure when adding pages or components

## When Editing

- Keep changes minimal and focused
- Avoid breaking API contracts with the backend
- Add small comments only when logic is non-obvious
