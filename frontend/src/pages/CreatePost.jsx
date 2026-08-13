import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../api/postApi";
import { getCategories } from "../api/categoryApi";
import Spinner from "../components/Spinner";
import PostEditor from "../components/PostEditor";

const CreatePost = () => {
  const [form, setForm] = useState({
    title: "",
    content: "",
    tags: "",
    category: "",
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getCategories();
        const categoryList = response.data.categories || [];
        setCategories(categoryList);

        if (categoryList.length) {
          setForm((current) => ({ ...current, category: current.category || categoryList[0].name }));
        }
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

    try {
      const response = await createPost(form);
      navigate(`/post/${response.data.post.slug}`, { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to create the post.");
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
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="rounded-4xl border border-white/10 bg-slate-950/80 p-6 text-white shadow-[0_24px_100px_rgba(15,23,42,0.2)] backdrop-blur-xl lg:p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/75">Create post</p>
        <h2 className="mt-3 text-4xl font-semibold">Draft and publish a new article.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
          Pick a topic, add tags, and publish directly to the feed.
        </p>
      </section>

      <PostEditor
        form={form}
        setForm={setForm}
        categories={categories}
        onSubmit={handleSubmit}
        loading={saving}
        error={error}
        submitLabel="Publish post"
      />
    </div>
  );
};

export default CreatePost;
