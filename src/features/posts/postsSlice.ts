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
type NewPost = Pick<Post, 'title' | 'content' | 'user'>

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

export const fetchPosts = createAppAsyncThunk(
  `${SLICE_NAME}/fetchPosts`,
  async () => {
    const response = await client.get<Post[]>('/fakeApi/posts')
    return response.data
  },
  {
    // only fetch if the posts are not already being fetched
    condition(arg, thunkApi) {
      const postsStatus = selectPostsStatus(thunkApi.getState())
      return postsStatus === 'idle'
    },
  },
)

export const addNewPost = createAppAsyncThunk(
  `${SLICE_NAME}/addNewPost`,
  // The payload creator receives the partial `{title, content, user}` object
  async (initialPost: NewPost) => {
    // we send the initial data to the fake API server
    const response = await client.post<Post>('/fakeApi/posts', initialPost)
    // The response includes the complese post object, including unique ID
    return response.data
  },
)

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
    // The existing `postAdded` reducer and prepare callback are deleted in favor of `addNewPost` thunk and a reducer for the same
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
        // create payload for updating the post action based on the arguments
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
      .addCase(addNewPost.fulfilled, (state, action) => {
        // we can directly add the new post object to our posts array
        state.posts.push(action.payload)
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
export const { postUpdated, reactionAdded } = postsSlice.actions

// export the generated reducer function
export default postsSlice.reducer

// selector functions
export const { selectAllPosts, selectPostById, selectPostsStatus, selectPostsError } = postsSlice.selectors
