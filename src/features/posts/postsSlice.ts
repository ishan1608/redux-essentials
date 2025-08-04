import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit'
import { sub } from 'date-fns'

// Define a TS type for the data we'll be using
export interface Post {
  id: string
  title: string
  content: string,
  user: string,
  date: string,
}

type PostUpdate = Pick<Post, 'id' | 'title' | 'content'>

// create an initial state value for the reducer, with that type
const initialState: Post[] = [
  {
    id: '1',
    title: 'First Post!',
    content: 'Hello World!',
    user: '0',
    date: sub(new Date(), { minutes: 10 }).toISOString()
  },
  {
    id: '2',
    title: 'Second Post',
    content: 'Lorem ipsum dolor sit amet',
    user: '2',
    date: sub(new Date(), { minutes: 5 }).toISOString()
  },
]

// create the slice and pass in the initial state
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // declare a "case reducer" named `postAdded`,
    // The type of `action.payload` will be a `Post` object.
    postAdded: {
      reducer(state: Post[], action: PayloadAction<Post>) {
        // "Mutate" the existing state array, which is safe to do here because `createSlice` used Immer inside.
        state.push(action.payload)
      },
      prepare(title: string, content: string, userId: string) {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
            user: userId,
            date: new Date().toISOString(),
          },
        }
      },
    },
    postUpdated: {
      reducer(state: Post[], action: PayloadAction<PostUpdate>) {
        const { id, title, content } = action.payload
        const post = state.find((post) => post.id === id)
        if (!post) {
          return
        }
        post.title = title
        post.content = content
      },
      prepare(id: string, title: string, content: string) {
        return {
          payload: {
            id,
            title,
            content,
          },
        }
      },
    },
  },
  selectors: {
    selectAllPosts(statePosts) {
      return statePosts
    },
    selectPostById(statePosts, postId) {
      return statePosts.find((post) => post.id === postId)
    },
  },
})

// export the auto-generated action creator with the same name
export const { postAdded, postUpdated } = postsSlice.actions

// export the generated reducer function
export default postsSlice.reducer

// selector functions
export const { selectAllPosts, selectPostById } = postsSlice.selectors
