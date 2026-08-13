import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { createCategory, getCategories } from "../api/categoryApi";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data.categories || []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load categories.");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await createCategory(name);
      setCategories((current) => [response.data.newCategory, ...current]);
      setName("");
      setSuccess("Category created successfully.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to create the category.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center rounded-[1.75rem] border border-white/10 bg-slate-950/70">
        <Spinner label="Loading categories" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="rounded-4xl border border-white/10 bg-slate-950/80 p-6 text-white shadow-[0_24px_100px_rgba(15,23,42,0.2)] backdrop-blur-xl lg:p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-amber-200/75">Admin tools</p>
        <h2 className="mt-3 text-4xl font-semibold">Manage post categories.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
          Categories are simple labels used when creating and filtering posts.
        </p>
      </section>

      <section className="rounded-[1.75rem] border border-white/10 bg-white/80 p-6 shadow-[0_24px_100px_rgba(15,23,42,0.12)] backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="New category name"
            className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400"
            required
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Adding..." : "Create category"}
          </button>
        </form>

        {error ? (
          <div className="mt-4 rounded-2xl border border-rose-300/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="mt-4 rounded-2xl border border-emerald-300/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        ) : null}
      </section>

      <section className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-6 text-white shadow-[0_24px_100px_rgba(15,23,42,0.18)] backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-2xl font-semibold">Existing categories</h3>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-300">
            {categories.length}
          </span>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {categories.map((category) => (
            <span
              key={category._id}
              className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm capitalize text-cyan-100"
            >
              {category.name}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminCategories;
