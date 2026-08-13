import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getPosts, updatePost } from "../api/postApi";
import { getCategories } from "../api/categoryApi";
import Spinner from "../components/Spinner";
import PostEditor from "../components/PostEditor";

const EditPost = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
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
  const [post, setPost] = useState(location.state?.post || null);

  useEffect(() => {
    const loadEditData = async () => {
      setLoading(true);
      setError("");

      try {
        const [postsResponse, categoriesResponse] = await Promise.all([getPosts(), getCategories()]);
        const resolvedPost = location.state?.post || postsResponse.data.posts?.find((item) => item._id === id);

        if (!resolvedPost) {
          throw new Error("Post not found");
        }

        setPost(resolvedPost);
        setCategories(categoriesResponse.data.categories || []);

        const categoryId = typeof resolvedPost.category === "string" ? resolvedPost.category : resolvedPost.category?._id;
        const resolvedCategory =
          categoriesResponse.data.categories?.find((category) => category._id === categoryId)?.name ||
          resolvedPost.category?.name ||
          "";

        setForm({
          title: resolvedPost.title || "",
          content: resolvedPost.content || "",
          tags: Array.isArray(resolvedPost.tags) ? resolvedPost.tags.join(", ") : "",
          category: resolvedCategory,
        });
      } catch (requestError) {
        setError(requestError.response?.data?.message || requestError.message || "Unable to load this post.");
      } finally {
        setLoading(false);
      }
    };

    loadEditData();
  }, [id, location.state?.post]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await updatePost(id, form);
      navigate(`/post/${response.data.post.slug}`, { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to update the post.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center rounded-[1.75rem] border border-white/10 bg-slate-950/70">
        <Spinner label="Loading post" />
      </div>
    );
  }

  if (!post && error) {
    return (
      <div className="rounded-[1.75rem] border border-rose-300/20 bg-rose-500/10 p-5 text-rose-100">
        {error}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="rounded-4xl border border-white/10 bg-slate-950/80 p-6 text-white shadow-[0_24px_100px_rgba(15,23,42,0.2)] backdrop-blur-xl lg:p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/75">Edit post</p>
        <h2 className="mt-3 text-4xl font-semibold">Refine your article.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
          Update the title, body, tags, or category and publish the new version immediately.
        </p>
      </section>

      <PostEditor
        form={form}
        setForm={setForm}
        categories={categories}
        onSubmit={handleSubmit}
        loading={saving}
        error={error}
        submitLabel="Save changes"
      />
    </div>
  );
};

export default EditPost;
