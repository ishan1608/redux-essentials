import { configureStore } from '@reduxjs/toolkit'
import postsReducer from '@/features/posts/postsSlice'

export const store = configureStore({
  reducer: {
    posts: postsReducer,
  },
})

// infer the type of the store
export type AppStore = typeof store

// infer the AppDispatch type from the store itself
export type AppDispatch = typeof store.dispatch

// Infer the RootState type
export type RootState = ReturnType<typeof store.getState>
