import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";

const Navbar = () => {
  const { user, loading, logout } = useAuth();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleSearch = (event) => {
    event.preventDefault();

    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      return;
    }

    navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    setQuery("");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="group flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-amber-300 text-lg font-black text-slate-950 shadow-lg shadow-cyan-500/20">
              B
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">MERN blog</p>
              <h1 className="text-lg font-semibold text-white group-hover:text-cyan-200">Blog Atlas</h1>
            </div>
          </Link>

          <div className="xl:hidden">
            {user ? (
              <Link
                to="/profile"
                className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
              >
                {user.username}
              </Link>
            ) : null}
          </div>
        </div>

        <form onSubmit={handleSearch} className="order-3 w-full xl:order-none xl:max-w-xl">
          <label className="sr-only" htmlFor="site-search">
            Search posts
          </label>
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/8 px-3 py-2 shadow-[0_8px_30px_rgba(2,6,23,0.2)]">
            <span className="text-sm text-slate-300">Search</span>
            <input
              id="site-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Title, content, or topic"
              className="w-full bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Go
            </button>
          </div>
        </form>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          {loading ? <span className="text-slate-300">Checking session…</span> : null}
          {user ? (
            <>
              <Link
                to="/create"
                className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-cyan-100 transition hover:bg-cyan-300/20"
              >
                New post
              </Link>
              {user.role === "admin" ? (
                <Link
                  to="/admin/categories"
                  className="rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-amber-100 transition hover:bg-amber-300/20"
                >
                  Categories
                </Link>
              ) : null}
              <Link
                to="/profile"
                className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-white transition hover:bg-white/12"
              >
                {user.username}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full bg-white px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-white transition hover:bg-white/12"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-cyan-400 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
