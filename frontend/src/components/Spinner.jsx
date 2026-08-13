const Spinner = ({ label = "Loading" }) => {
  return (
    <div className="flex flex-col items-center gap-3 text-slate-200">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-300/30 border-t-cyan-300" />
      <p className="text-sm tracking-wide text-slate-300">{label}</p>
    </div>
  );
};

export default Spinner;