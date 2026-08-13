const LikeButton = ({ liked, count, onToggle, disabled }) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${liked
          ? "bg-rose-500 text-white hover:bg-rose-400"
          : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
        } disabled:cursor-not-allowed disabled:opacity-60`}
    >
      <span>{liked ? "Liked" : "Like"}</span>
      <span className="rounded-full bg-black/20 px-2 py-0.5 text-xs">{count}</span>
    </button>
  );
};

export default LikeButton;