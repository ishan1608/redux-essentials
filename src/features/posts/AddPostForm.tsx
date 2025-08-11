import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { addNewPost } from '@/features/posts/postsSlice'
import { selectCurrentUserName } from '@/features/auth/authSlice'

// TS types for the input fields
// See: https://epicreact.dev/how-to-type-a-react-form-on-submit-handler/
interface AddPostFormFields extends HTMLFormControlsCollection {
  postTitle: HTMLInputElement
  postContent: HTMLTextAreaElement
}

interface AddPostFormElements extends HTMLFormElement {
  readonly elements: AddPostFormFields
}

export const AddPostForm = () => {
  const [addRequestStatus, setAddRequestStatus] = useState<'idle' | 'pending'>('idle')

  const dispatch = useAppDispatch()
  const username = useAppSelector(selectCurrentUserName)

  const handleSubmit = (e: React.FormEvent<AddPostFormElements>) => {
    // Prevent server submission
    e.preventDefault()

    const { elements } = e.currentTarget
    const title = elements.postTitle.value
    const content = elements.postContent.value

    try {
      // mark the request as pending
      setAddRequestStatus('pending')

      // dispatch the async thunk to save the post and get the Promise from the thunk using the .unwrap() function
      dispatch(
        addNewPost({
          title,
          content,
          user: username!,
        }),
      ).unwrap()

      e.currentTarget.reset()
    } catch (err) {
      console.error('Failed to save the post: ', err)
    } finally {
      setAddRequestStatus('idle')
    }
  }

  return (
    <section>
      <h2>Add a New Post</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="postTitle">Post Title:</label>
        <input type="text" id="postTitle" defaultValue="" required />
        <label htmlFor="postContent">Content:</label>
        <textarea id="postContent" name="postContent" defaultValue="" required />
        <button>Save Post</button>
      </form>
    </section>
  )
}
