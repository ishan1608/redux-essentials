import { createSlice } from '@reduxjs/toolkit'
import { selectCurrentUserName } from '@/features/auth/authSlice'
import { RootState } from '@/app/store'

interface User {
  id: string
  name: string
}

const initialState: User[] = [
  {
    id: '0',
    name: 'Tianna Jenkins',
  },
  {
    id: '1',
    name: 'Kevin Grant',
  },
  {
    id: '2',
    name: 'Madison Price',
  },
  {
    id: '3',
    name: 'Andy Weir',
  },
]

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  selectors: {
    selectAllUsers: (stateUsers) => stateUsers,
    selectUserById: (stateUsers, userId) => stateUsers.find((user) => user.id === userId),
  },
})

export default usersSlice.reducer
export const { selectAllUsers, selectUserById } = usersSlice.selectors
export const selectCurrentUser = (state: RootState) => {
  const currentUsername = selectCurrentUserName(state)
  return selectUserById(state, currentUsername)
}
