import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAuth from "../context/useAuth";
import Spinner from "../components/Spinner";
import LikeButton from "../components/LikeButton";
import CommentSection from "../components/CommentSection";
import { getPostBySlug, deletePost } from "../api/postApi";
import { getCategories } from "../api/categoryApi";
import { addComment, deleteComment, getComments } from "../api/commentApi";
import { getLikeStatus, toggleLike } from "../api/likeApi";

const PostDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      setError("");

      try {
        const [postResponse, categoriesResponse] = await Promise.all([
          getPostBySlug(slug),
          getCategories(),
        ]);

        setPost(postResponse.data.post);
        setCategories(categoriesResponse.data.categories || []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load this post.");
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  useEffect(() => {
    if (!post) {
      return;
    }

    const loadDetailData = async () => {
      setDetailLoading(true);

      try {
        const [commentsResponse, likeResponse] = await Promise.all([
          getComments(post._id),
          user ? getLikeStatus(post._id) : Promise.resolve({ data: { liked: false } }),
        ]);

        setComments(commentsResponse.data.comments || []);
        setLiked(Boolean(likeResponse.data.liked));
        setLikeCount(post.likesCount || 0);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load comments and likes.");
      } finally {
        setDetailLoading(false);
      }
    };

    loadDetailData();
  }, [post, user]);

  const categoryName = useMemo(() => {
    if (!post) {
      return "";
    }

    const categoryId = typeof post.category === "string" ? post.category : post.category?._id;
    return categories.find((category) => category._id === categoryId)?.name || post.category?.name || "uncategorized";
  }, [post, categories]);

  const authorId = typeof post?.author === "string" ? post.author : post?.author?._id;
  const canManagePost = Boolean(user && post && (user.role === "admin" || authorId === user._id));

  const handleLikeToggle = async () => {
    if (!post) {
      return;
    }

    try {
      await toggleLike(post._id);
      const nextLiked = !liked;
      setLiked(nextLiked);
      setLikeCount((currentCount) => (nextLiked ? currentCount + 1 : Math.max(0, currentCount - 1)));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to update like status.");
    }
  };

  const handleAddComment = async (content) => {
    if (!post) {
      return;
    }

    setCommentSubmitting(true);

    try {
      const response = await addComment(post._id, content);
      setComments((currentComments) => [response.data.comment, ...currentComments]);
      setPost((currentPost) => ({
        ...currentPost,
        commentsCount: (currentPost.commentsCount || 0) + 1,
      }));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to add your comment.");
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!post) {
      return;
    }

    setDeletingCommentId(commentId);

    try {
      await deleteComment(post._id, commentId);
      setComments((currentComments) => currentComments.filter((comment) => comment._id !== commentId));
      setPost((currentPost) => ({
        ...currentPost,
        commentsCount: Math.max(0, (currentPost.commentsCount || 0) - 1),
      }));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to delete this comment.");
    } finally {
      setDeletingCommentId("");
    }
  };

  const handleDeletePost = async () => {
    if (!post) {
      return;
    }

    const confirmed = window.confirm("Delete this post permanently?");
    if (!confirmed) {
      return;
    }

    try {
      await deletePost(post._id);
      navigate("/");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to delete the post.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center rounded-[1.75rem] border border-white/10 bg-slate-950/70">
        <Spinner label="Loading post" />
      </div>
    );
  }

  if (error && !post) {
    return (
      <div className="rounded-[1.75rem] border border-rose-300/20 bg-rose-500/10 p-5 text-rose-100">
        {error}
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="space-y-6">
      <article className="overflow-hidden rounded-4xl border border-white/10 bg-slate-950/80 p-6 shadow-[0_24px_100px_rgba(15,23,42,0.2)] backdrop-blur-xl lg:p-8">
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.3em] text-cyan-200/70">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 capitalize text-white">
            {categoryName}
          </span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>

        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4">
            <h2 className="max-w-4xl text-4xl font-semibold text-white sm:text-5xl">
              {post.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
              <span>Author {authorId ? authorId.slice(-6) : "unknown"}</span>
              <span>{post.commentsCount || 0} comments</span>
              <span>{likeCount} likes</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {user ? <LikeButton liked={liked} count={likeCount} onToggle={handleLikeToggle} disabled={detailLoading} /> : null}
            {canManagePost ? (
              <>
                <Link
                  to={`/edit/${post._id}`}
                  state={{ post }}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={handleDeletePost}
                  className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-400"
                >
                  Delete
                </button>
              </>
            ) : null}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {post.tags?.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-100"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="mt-8">
          <p className="whitespace-pre-wrap text-base leading-8 text-slate-200">{post.content}</p>
        </div>
      </article>

      {detailLoading ? (
        <div className="flex min-h-[20vh] items-center justify-center rounded-[1.75rem] border border-white/10 bg-slate-950/70">
          <Spinner label="Loading discussion" />
        </div>
      ) : (
        <CommentSection
          comments={comments}
          currentUser={user}
          postAuthorId={authorId}
          onAddComment={handleAddComment}
          onDeleteComment={handleDeleteComment}
          submitting={commentSubmitting}
          deletingId={deletingCommentId}
        />
      )}
    </div>
  );
};

export default PostDetail;
