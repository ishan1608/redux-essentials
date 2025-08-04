import { AddPostForm } from '@/features/posts/AddPostForm'
import { PostsList } from '@/features/posts/PostsList'

export const PostsMainPage = () => {
  return (
    <>
      <AddPostForm />
      <PostsList />
    </>
  )
}
