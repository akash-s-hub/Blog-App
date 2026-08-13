import { useMemo } from "react";

const PostEditor = ({
  form,
  setForm,
  categories,
  onSubmit,
  loading,
  error,
  submitLabel,
}) => {
  const categoryOptions = useMemo(() => categories || [], [categories]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-6 shadow-[0_24px_100px_rgba(15,23,42,0.18)] backdrop-blur-xl">
      {error ? (
        <div className="rounded-2xl border border-rose-300/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-2">
        <label className="space-y-2 lg:col-span-2">
          <span className="text-sm font-medium text-slate-200">Title</span>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-300/50"
            placeholder="Give the post a sharp headline"
            required
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-200">Category</span>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-300/50"
            required
          >
            <option value="">Select a category</option>
            {categoryOptions.map((category) => (
              <option key={category._id} value={category.name} className="text-slate-950">
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-200">Tags</span>
          <input
            type="text"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-300/50"
            placeholder="react, api, ui"
            required
          />
        </label>

        <label className="space-y-2 lg:col-span-2">
          <span className="text-sm font-medium text-slate-200">Content</span>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows={14}
            className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-300/50"
            placeholder="Write the article body here"
            required
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Saving..." : submitLabel}
      </button>
    </form>
  );
};

export default PostEditor;