import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="mx-auto flex min-h-[65vh] max-w-3xl items-center justify-center">
      <div className="w-full rounded-4xl border border-white/10 bg-slate-950/80 p-8 text-center text-white shadow-[0_24px_100px_rgba(15,23,42,0.2)] backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/75">404</p>
        <h2 className="mt-4 text-5xl font-semibold">This page drifted off the map.</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-300">
          The link may be broken or the page may have been moved. Return to the feed and continue exploring.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/" className="rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950">
            Go home
          </Link>
          <Link to="/search" className="rounded-full border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white">
            Search posts
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
