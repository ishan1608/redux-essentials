import { createSlice } from '@reduxjs/toolkit'
import { selectCurrentUserName } from '@/features/auth/authSlice'
import { RootState } from '@/app/store'
import { createAppAsyncThunk } from '@/app/withTypes'
import { client } from '@/api/client'

const SLICE_NAME = 'users'

interface User {
  id: string
  name: string
}

export const fetchUsers = createAppAsyncThunk(
  `${SLICE_NAME}/fetchUsers`,
  async () => {
    const response = await client.get<User[]>('/fakeApi/users')
    return response.data
  }
)

const initialState: User[] = []

const usersSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {},
  selectors: {
    selectAllUsers: (stateUsers) => stateUsers,
    selectUserById: (stateUsers, userId) => stateUsers.find((user) => user.id === userId),
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      // direcly returning the list of users, thus overriding the existing state
      return action.payload
    })
  }
})

export default usersSlice.reducer
export const { selectAllUsers, selectUserById } = usersSlice.selectors
export const selectCurrentUser = (state: RootState) => {
  const currentUsername = selectCurrentUserName(state)
  return selectUserById(state, currentUsername)
}
