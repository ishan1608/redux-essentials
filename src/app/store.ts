import { configureStore } from '@reduxjs/toolkit'
import type { Action } from '@reduxjs/toolkit'

interface CounterState {
  value: number
}

function counterReducer(state: CounterState = { value: 0 }, action: Action) {
  switch (action.type) {
    default: {
      return state
    }
  }
}

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
})

// infer the type of the store
export type AppStore = typeof store

// infer the AppDispatch type from the store itself
export type AppDispatch = typeof store.dispatch

// Infer the RootState type
export type RootState = ReturnType<typeof store.getState>
