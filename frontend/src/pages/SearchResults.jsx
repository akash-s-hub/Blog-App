import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import useAuth from "../context/useAuth";
import Spinner from "../components/Spinner";
import PostCard from "../components/PostCard";
import { getCategories } from "../api/categoryApi";
import { deletePost } from "../api/postApi";
import { searchPosts } from "../api/searchApi";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() || "";
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadSearchResults = async () => {
      setLoading(true);
      setError("");

      try {
        if (!query) {
          setPosts([]);
          return;
        }

        const [searchResponse, categoriesResponse] = await Promise.all([
          searchPosts(query),
          getCategories(),
        ]);

        setPosts(searchResponse.data.posts || []);
        setCategories(categoriesResponse.data.categories || []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load search results.");
      } finally {
        setLoading(false);
      }
    };

    loadSearchResults();
  }, [query]);

  const categoryMap = useMemo(
    () => new Map(categories.map((category) => [category._id, category.name])),
    [categories]
  );

  const handleDelete = async (postId) => {
    const confirmed = window.confirm("Delete this post permanently?");
    if (!confirmed) {
      return;
    }

    try {
      await deletePost(postId);
      setPosts((currentPosts) => currentPosts.filter((post) => post._id !== postId));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to delete the post.");
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-4xl border border-white/10 bg-slate-950/80 p-6 text-white shadow-[0_24px_100px_rgba(15,23,42,0.2)] backdrop-blur-xl lg:p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/75">Search</p>
        <h2 className="mt-3 text-4xl font-semibold">Results for {query || "your query"}.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
          Search uses the backend text index and returns the most relevant matches first.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/" className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950">
            Back to feed
          </Link>
          <Link to="/create" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white">
            New post
          </Link>
        </div>
      </section>

      {!query ? (
        <div className="rounded-[1.75rem] border border-dashed border-white/10 bg-slate-950/70 p-10 text-center text-slate-300">
          Enter a search term in the navbar to start exploring.
        </div>
      ) : loading ? (
        <div className="flex min-h-[40vh] items-center justify-center rounded-[1.75rem] border border-white/10 bg-slate-950/70">
          <Spinner label="Searching posts" />
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-300/20 bg-rose-500/10 p-5 text-rose-100">
          {error}
        </div>
      ) : posts.length ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {posts.map((post) => {
            const postCategoryId = typeof post.category === "string" ? post.category : post.category?._id;
            const categoryName = categoryMap.get(postCategoryId) || post.category?.name || "uncategorized";
            const canManage = user && (user.role === "admin" || post.author === user._id || post.author?._id === user._id);

            return (
              <PostCard
                key={post._id}
                post={post}
                categoryName={categoryName}
                canManage={canManage}
                onEdit={() => navigate(`/edit/${post._id}`, { state: { post } })}
                onDelete={() => handleDelete(post._id)}
              />
            );
          })}
        </div>
      ) : (
        <div className="rounded-[1.75rem] border border-dashed border-white/10 bg-slate-950/70 p-10 text-center text-slate-300">
          No posts matched this search.
        </div>
      )}
    </div>
  );
};

export default SearchResults;