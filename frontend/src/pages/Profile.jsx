import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";
import Spinner from "../components/Spinner";
import PostCard from "../components/PostCard";
import { deletePost, getPostsByUser } from "../api/postApi";
import { updateMe, updatePassword as updatePasswordRequest } from "../api/authApi";

const Profile = () => {
  const { user, loading, setUser, checkAuth } = useAuth();
  const [posts, setPosts] = useState([]);
  const [profileForm, setProfileForm] = useState({
    username: "",
    email: "",
    bio: "",
    avatar: null,
  });
  const [passwordForm, setPasswordForm] = useState({ password: "", newPassword: "" });
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      return;
    }

    setProfileForm({
      username: user.username || "",
      email: user.email || "",
      bio: user.bio || "",
      avatar: null,
    });
  }, [user]);

  useEffect(() => {
    const loadUserPosts = async () => {
      if (!user?._id) {
        setLoadingPosts(false);
        return;
      }

      setLoadingPosts(true);

      try {
        const response = await getPostsByUser(user._id);
        setPosts(response.data.posts || []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load your posts.");
      } finally {
        setLoadingPosts(false);
      }
    };

    loadUserPosts();
  }, [user]);

  const canManage = useMemo(() => Boolean(user), [user]);

  const handleProfileChange = (event) => {
    const { name, value, type, files } = event.target;
    setProfileForm((current) => ({
      ...current,
      [name]: type === "file" ? files?.[0] || null : value,
    }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((current) => ({ ...current, [name]: value }));
  };

  const handleUpdateProfile = async (event) => {
    event.preventDefault();
    setSavingProfile(true);
    setError("");
    setSuccess("");

    try {
      const payload = new FormData();
      payload.append("username", profileForm.username);
      payload.append("email", profileForm.email);
      payload.append("bio", profileForm.bio);

      if (profileForm.avatar) {
        payload.append("avatar", profileForm.avatar);
      }

      const response = await updateMe(payload);
      setUser({
        ...response.data.user,
        avatarUrl: response.data.user.avatarUrl || response.data.user.avatar || "",
      });
      setSuccess("Profile updated successfully.");
      await checkAuth();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to update your profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (event) => {
    event.preventDefault();
    setSavingPassword(true);
    setError("");
    setSuccess("");

    try {
      await updatePasswordRequest(passwordForm);
      setPasswordForm({ password: "", newPassword: "" });
      setSuccess("Password updated successfully.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to update your password.");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleDeletePost = async (postId) => {
    const confirmed = window.confirm("Delete this post permanently?");
    if (!confirmed) {
      return;
    }

    try {
      await deletePost(postId);
      setPosts((currentPosts) => currentPosts.filter((post) => post._id !== postId));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to delete this post.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center rounded-[1.75rem] border border-white/10 bg-slate-950/70">
        <Spinner label="Loading profile" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-4xl border border-white/10 bg-slate-950/80 p-6 text-white shadow-[0_24px_100px_rgba(15,23,42,0.2)] backdrop-blur-xl lg:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/75">Your profile</p>
            <h2 className="mt-3 text-4xl font-semibold">Manage your account and posts.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              Update your author details, change your password, and manage the articles you have published.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
            <p className="text-lg font-semibold text-white">{user.username}</p>
            <p>{user.email}</p>
            <p className="mt-2 capitalize">Role: {user.role}</p>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-2xl border border-rose-300/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="mt-6 rounded-2xl border border-emerald-300/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
            {success}
          </div>
        ) : null}
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <form onSubmit={handleUpdateProfile} className="space-y-4 rounded-[1.75rem] border border-white/10 bg-white/80 p-6 shadow-[0_24px_100px_rgba(15,23,42,0.12)] backdrop-blur-xl">
          <h3 className="text-2xl font-semibold text-slate-950">Edit profile</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Username</span>
              <input
                type="text"
                name="username"
                value={profileForm.username}
                onChange={handleProfileChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400"
                required
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input
                type="email"
                name="email"
                value={profileForm.email}
                onChange={handleProfileChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400"
                required
              />
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Bio</span>
            <textarea
              name="bio"
              value={profileForm.bio}
              onChange={handleProfileChange}
              rows={4}
              className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Avatar</span>
            <input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleProfileChange}
              className="w-full rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-full file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-white"
            />
          </label>

          <button
            type="submit"
            disabled={savingProfile}
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {savingProfile ? "Saving..." : "Update profile"}
          </button>
        </form>

        <form onSubmit={handleUpdatePassword} className="space-y-4 rounded-[1.75rem] border border-white/10 bg-white/80 p-6 shadow-[0_24px_100px_rgba(15,23,42,0.12)] backdrop-blur-xl">
          <h3 className="text-2xl font-semibold text-slate-950">Change password</h3>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Current password</span>
            <input
              type="password"
              name="password"
              value={passwordForm.password}
              onChange={handlePasswordChange}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400"
              required
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">New password</span>
            <input
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400"
              required
            />
          </label>

          <button
            type="submit"
            disabled={savingPassword}
            className="rounded-full border border-slate-950 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-950 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {savingPassword ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>

      <section className="space-y-5 rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-6 shadow-[0_24px_100px_rgba(15,23,42,0.18)] backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/75">Your posts</p>
            <h3 className="text-2xl font-semibold text-white">Published articles</h3>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-300">
            {posts.length} posts
          </span>
        </div>

        {loadingPosts ? (
          <div className="flex min-h-[28vh] items-center justify-center rounded-3xl border border-white/10 bg-white/5">
            <Spinner label="Loading your posts" />
          </div>
        ) : posts.length ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                categoryName={post.category?.name || "uncategorized"}
                canManage={canManage}
                onEdit={() => navigate(`/edit/${post._id}`, { state: { post } })}
                onDelete={() => handleDeletePost(post._id)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-white/10 px-5 py-10 text-center text-sm text-slate-400">
            You have not published anything yet.
          </div>
        )}
      </section>
    </div>
  );
};

export default Profile;
