import { Link } from "react-router-dom";

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "";

const getAuthorLabel = (author) => {
  if (!author) {
    return "Unknown author";
  }

  if (typeof author === "string") {
    return `Author ${author.slice(-6)}`;
  }

  return author.username || `Author ${String(author._id || "").slice(-6)}`;
};

const PostCard = ({ post, categoryName, canManage, onEdit, onDelete }) => {
  const excerpt = post.content.length > 180 ? `${post.content.slice(0, 180)}...` : post.content;

  return (
    <article className="group overflow-hidden rounded-3xl border border-white/10 bg-slate-950/75 p-5 shadow-[0_24px_100px_rgba(15,23,42,0.18)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-300/30">
      <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-400">
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 capitalize text-slate-200">
          {categoryName || "uncategorized"}
        </span>
        <span>{formatDate(post.createdAt)}</span>
      </div>

      <Link to={`/post/${post.slug}`} className="mt-4 block space-y-3">
        <h3 className="text-2xl font-semibold text-white transition group-hover:text-cyan-200">
          {post.title}
        </h3>
        <p className="line-clamp-4 text-sm leading-6 text-slate-300">{excerpt}</p>
      </Link>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {post.tags?.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-100"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-sm text-slate-300">
        <div>
          <p className="font-medium text-white">{getAuthorLabel(post.author)}</p>
          <p>{post.likesCount || 0} likes · {post.commentsCount || 0} comments</p>
        </div>

        {canManage ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onEdit}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white/10"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-rose-400"
            >
              Delete
            </button>
          </div>
        ) : null}
      </div>
    </article>
  );
};

export default PostCard;