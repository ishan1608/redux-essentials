import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

// Define a TS type for the data we'll be using
export interface Post {
  id: string
  title: string
  content: string
}

// create an initial state value for the reducer, with that type
const initialState: Post[] = [
  { id: '1', title: 'First Post!', content: 'Hello World!' },
  { id: '2', title: 'Second Post', content: 'Lorem ipsum dolor sit amet' },
]

// create the slice and pass in the initial state
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // declare a "case reducer" named `postAdded`,
    // The type of `action.payload` will be a `Post` object.
    postAdded(state: Post[], action: PayloadAction<Post>) {
      // "Mutate" the existing state array, which is safe to do here because `createSlice` used Immer inside.
      state.push(action.payload)
    },
    postUpdated(state: Post[], action: PayloadAction<Post>) {
      const { id, title, content } = action.payload
      const post = state.find(post => post.id === id)
      if (!post) {
        return
      }
      post.title = title
      post.content = content
    }
  },
})

// export the auto-generated action creator with the same name
export const { postAdded, postUpdated } = postsSlice.actions

// export the generated reducer function
export default postsSlice.reducer
