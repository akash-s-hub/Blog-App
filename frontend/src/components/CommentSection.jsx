import { useState } from "react";

const CommentSection = ({
  comments,
  currentUser,
  postAuthorId,
  onAddComment,
  onDeleteComment,
  submitting,
  deletingId,
}) => {
  const [content, setContent] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmed = content.trim();
    if (!trimmed) {
      return;
    }

    await onAddComment(trimmed);
    setContent("");
  };

  return (
    <section className="space-y-5 rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-6 shadow-[0_24px_100px_rgba(15,23,42,0.18)] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-lg font-semibold text-white">Discussion</p>
          <p className="text-sm text-slate-400">Share reactions and feedback on the post.</p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.25em] text-slate-300">
          {comments.length} comments
        </span>
      </div>

      {currentUser ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={4}
            placeholder="Write a comment"
            className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-300/50"
          />
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Logged in as {currentUser.username}</p>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Posting..." : "Post comment"}
            </button>
          </div>
        </form>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
          Sign in to join the conversation.
        </div>
      )}

      <div className="space-y-3">
        {comments.length ? (
          comments.map((comment) => {
            const author = comment.author;
            const canDelete =
              currentUser &&
              (author?._id === currentUser._id ||
                postAuthorId === currentUser._id ||
                currentUser.role === "admin");

            return (
              <article key={comment._id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">{author?.username || "Anonymous"}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {canDelete ? (
                    <button
                      type="button"
                      onClick={() => onDeleteComment(comment._id)}
                      disabled={deletingId === comment._id}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 transition hover:bg-white/10 disabled:opacity-60"
                    >
                      {deletingId === comment._id ? "Removing" : "Delete"}
                    </button>
                  ) : null}
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-300">
                  {comment.content}
                </p>
              </article>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-slate-400">
            No comments yet.
          </div>
        )}
      </div>
    </section>
  );
};

export default CommentSection;