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
  reducers: {},
})

// export the generated reducer function
export default postsSlice.reducer
