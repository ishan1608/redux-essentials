import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit'
import { sub } from 'date-fns'
import { userLoggedOut } from '@/features/auth/authSlice'

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

// create an initial state value for the reducer, with that type
const initialState: Post[] = [
  {
    id: '1',
    title: 'First Post!',
    content: 'Hello World!',
    user: '0',
    date: sub(new Date(), { minutes: 15 }).toISOString(),
    reactions: { ...initialReactions },
  },
  {
    id: '2',
    title: 'Second Post',
    content: 'Lorem ipsum dolor sit amet',
    user: '2',
    date: sub(new Date(), { minutes: 10 }).toISOString(),
    reactions: { ...initialReactions },
  },
  {
    id: '3',
    title: 'Project Hail Mary',
    content:
      'Project Hail Mary refers both to a bestselling science fiction novel by Andy Weir (2021) and its upcoming major film adaptation, directed by Phil Lord and Christopher Miller and starring Ryan Gosling, scheduled for release on March 20, 2026.\n' +
      "The story centers on Ryland Grace, a former molecular biologist and school teacher, who wakes up alone on a spaceship with amnesia and gradually remembers that he is humanity's last hope: sent to the Tau Ceti system to find a solution for a mysterious solar dimming event that threatens all life on Earth\n" +
      '. Over the course of his mission, Grace discovers an alien organism called "Astrophage" that is responsible for the crisis, establishes first contact with an alien named Rocky, and must use his scientific knowledge and ingenuity to save both species.\n' +
      'The novel received critical acclaim and was nominated for major science fiction awards\n' +
      '. The film adaptation features Ryan Gosling as Ryland Grace, Sandra Hüller as Eva Stratt, and Milana Vayntrub, with Daniel Pemberton composing the score. Principal photography took place in the UK in 2024, and the film is set for release by Amazon MGM Studios.\n' +
      'For readers, Project Hail Mary offers a blend of hard science, suspenseful discovery, and an emphasis on problem-solving amid extraordinary challenges',
    user: '3',
    date: sub(new Date(), { minutes: 5 }).toISOString(),
    reactions: { ...initialReactions },
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
            reactions: { ...initialReactions },
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
    reactionAdded(
      state,
      action: PayloadAction<{
        postId: string
        reaction: ReactionName
      }>,
    ) {
      const { postId, reaction } = action.payload
      const existingPost = state.find((post) => post.id === postId)
      if (!existingPost) {
        return
      }
      existingPost.reactions[reaction]++
    },
  },
  extraReducers: (builder) => {
    // Pass the action creator to `builder.addCase()`
    builder.addCase(userLoggedOut, (state: Post[]) => {
      // clear out the list of posts whenever the user logs out
      return []
    })
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
export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions

// export the generated reducer function
export default postsSlice.reducer

// selector functions
export const { selectAllPosts, selectPostById } = postsSlice.selectors
