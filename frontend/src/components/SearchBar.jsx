const SearchBar = ({ search, setSearch }) => {
    return (
        <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-emerald-600"
        />
    );
};

export default SearchBar;
