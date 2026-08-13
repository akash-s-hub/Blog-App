const CategoryFilter = ({ categories, value, onChange, onClear }) => {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={onClear}
        className={`rounded-full px-4 py-2 text-sm transition ${value ? "border border-white/10 bg-white/5 text-slate-100" : "bg-cyan-400 text-slate-950"
          }`}
      >
        All topics
      </button>
      {categories.map((category) => (
        <button
          key={category._id}
          type="button"
          onClick={() => onChange(category.name)}
          className={`rounded-full px-4 py-2 text-sm capitalize transition ${value === category.name
              ? "bg-amber-300 text-slate-950"
              : "border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
            }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;