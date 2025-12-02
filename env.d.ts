/// <reference types="vite/client" />

// Extend vue-router meta interface
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
  }
}

