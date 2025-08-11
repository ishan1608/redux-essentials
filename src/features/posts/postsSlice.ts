import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit'
import { userLoggedOut } from '@/features/auth/authSlice'

import { client } from '@/api/client'
import { createAppAsyncThunk } from '@/app/withTypes'

const SLICE_NAME = 'posts'

export interface Reactions {
  thumbsUp: number
  tada: number
  heart: number
  rocket: number
  eyes: number
}

// Define a TS type for the data we'll be using
export interface Post {
  id: string
  title: string
  content: string
  user: string
  date: string
  reactions: Reactions
}

type PostUpdate = Pick<Post, 'id' | 'title' | 'content'>

export type ReactionName = keyof Reactions

const initialReactions: Reactions = {
  thumbsUp: 0,
  tada: 0,
  heart: 0,
  rocket: 0,
  eyes: 0,
}

interface PostsState {
  posts: Post[]
  status: 'idle' | 'pending' | 'succeeded' | 'failed'
  error: string | null
}

export const fetchPosts = createAppAsyncThunk(`${SLICE_NAME}/fetchPosts`, async () => {
  const response = await client.get<Post[]>('/fakeApi/posts')
  return response.data
})

// create an initial state value for the reducer, with that type
const initialState: PostsState = {
  posts: [],
  status: 'idle',
  error: null,
}

// create the slice and pass in the initial state
const postsSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    // declare a "case reducer" named `postAdded`,
    // The type of `action.payload` will be a `Post` object.
    postAdded: {
      reducer(state: PostsState, action: PayloadAction<Post>) {
        // "Mutate" the existing state array, which is safe to do here because `createSlice` used Immer inside.
        state.posts.push(action.payload)
      },
      prepare(title: string, content: string, userId: string) {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
            user: userId,
            date: new Date().toISOString(),
            reactions: { ...initialReactions },
          },
        }
      },
    },
    postUpdated: {
      reducer(state: PostsState, action: PayloadAction<PostUpdate>) {
        const { id, title, content } = action.payload
        const post = state.posts.find((post) => post.id === id)
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
    reactionAdded(
      state: PostsState,
      action: PayloadAction<{
        postId: string
        reaction: ReactionName
      }>,
    ) {
      const { postId, reaction } = action.payload
      const existingPost = state.posts.find((post) => post.id === postId)
      if (!existingPost) {
        return
      }
      existingPost.reactions[reaction]++
    },
  },
  extraReducers: (builder) => {
    // Pass the action creator to `builder.addCase()`
    builder
      .addCase(userLoggedOut, (state: PostsState) => {
        // clear out the list of posts whenever the user logs out
        return initialState
      })
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = 'pending'
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        // Add any fetched posts to the array
        state.posts.push(...action.payload)
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Unknown Error'
      })
  },
  selectors: {
    selectAllPosts(statePosts) {
      return statePosts.posts
    },
    selectPostById(statePosts, postId) {
      return statePosts.posts.find((post) => post.id === postId)
    },
    selectPostsStatus(statePosts: PostsState) {
      return statePosts.status
    },
    selectPostsError(statePosts: PostsState) {
      return statePosts.error
    },
  },
})

// export the auto-generated action creator with the same name
export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions

// export the generated reducer function
export default postsSlice.reducer

// selector functions
export const { selectAllPosts, selectPostById, selectPostsStatus, selectPostsError } = postsSlice.selectors
