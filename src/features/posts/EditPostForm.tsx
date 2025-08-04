import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { postUpdated } from '@/features/posts/postsSlice'

// TS types for the input fields
// See: https://epicreact.dev/how-to-type-a-react-form-on-submit-handler/
interface EditPostFormFields extends HTMLFormControlsCollection {
  postTitle: HTMLInputElement
  postContent: HTMLTextAreaElement
}

interface EditPostFormElements extends HTMLFormElement {
  readonly elements: EditPostFormFields
}

export const EditPostForm = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { postId } = useParams();

  const post = useAppSelector(state => {
    return state.posts.find(post => post.id === postId)
  })

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    )
  }

  const onSavePostClicked = (event: React.FormEvent<EditPostFormElements>) => {
    // prevent server submission
    event.preventDefault()

    const { elements } = event.currentTarget
    const title = elements.postTitle.value
    const content = elements.postContent.value

    if (!title || !content) {
      return
    }

    // Dispatch the `postUpdated` action
    dispatch(postUpdated(post.id, title, content))

    // Navigate to the post page
    navigate(`/posts/${postId}`)
  }

  return (
    <section>
      <h2>Edit Post</h2>
      <form onSubmit={onSavePostClicked}>
        <label htmlFor='postTitle'>Post Title:</label>
        <input
          type='text'
          id='postTitle'
          name='postTitle'
          defaultValue={post.title}
          required
        />
        <label htmlFor='postContent'>Content:</label>
        <textarea
          id='postContent'
          name='postContent'
          defaultValue={post.content}
          required
        />

        <button>Save Post</button>
      </form>
    </section>
  )
}
