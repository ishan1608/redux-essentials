import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { selectAllUsers } from '@/features/users/usersSlice'
import { Navigate, useNavigate } from 'react-router-dom'
import { selectCurrentUserName, userLoggedIn } from '@/features/auth/authSlice'

interface LoginPageFormFields extends HTMLFormControlsCollection {
  username: HTMLSelectElement
}

interface LoginPageFormElements extends HTMLFormElement {
  readonly elements: LoginPageFormFields
}

export const LoginPage = () => {
  const dispatch = useAppDispatch()
  const users = useAppSelector(selectAllUsers)
  const navigate = useNavigate()
  const username = useAppSelector(selectCurrentUserName)

  if (username) {
    return <Navigate to="/posts" replace />
  }

  const onClickLogin = (e: React.FormEvent<LoginPageFormElements>) => {
    e.preventDefault()

    const username = e.currentTarget.elements.username.value

    dispatch(userLoggedIn(username))
    navigate('/posts')
  }

  const usersOptions = users.map((user) => {
    return (
      <option key={user.id} value={user.id}>
        {user.name}
      </option>
    )
  })

  return (
    <section>
      <h2>Welcome to Chirper!</h2>
      <h3>Please log in:</h3>
      <form onSubmit={onClickLogin}>
        <label htmlFor="username">User:</label>
        <select id="username" name="username" required>
          <option value=""></option>
          {usersOptions}
        </select>
        <button>Log In</button>
      </form>
    </section>
  )
}
