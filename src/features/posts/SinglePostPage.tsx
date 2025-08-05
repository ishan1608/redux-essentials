import { Link, useParams } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'
import { selectPostById } from '@/features/posts/postsSlice'
import { PostAuthor } from '@/features/posts/PostAuthor'
import { TimeAgo } from '@/features/posts/TimeAgo'
import { ReactionButtons } from '@/features/posts/ReactionButtons'
import { selectCurrentUserName } from '@/features/auth/authSlice'

export const SinglePostPage = () => {
  const { postId } = useParams()

  const post = useAppSelector((state) => selectPostById(state, postId!))

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    )
  }

  const username = useAppSelector(selectCurrentUserName)
  const canEdit = username === post.user

  return (
    <section>
      <article className="post">
        <h2>{post.title}</h2>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
        <p className="post-content">{post.content}</p>
        <ReactionButtons post={post} />
        {canEdit && (
          <Link to={`/editPost/${post.id}`} className="button">
            Edit Post
          </Link>
        )}
      </article>
    </section>
  )
}
