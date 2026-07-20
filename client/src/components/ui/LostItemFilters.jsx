function LostItemFilters({
  search,
  setSearch,
  category,
  setCategory,
  status,
  setStatus,
}) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-md mb-8">
      <div className="grid md:grid-cols-3 gap-4">

        <input
          type="text"
          placeholder="Search item..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Documents">Documents</option>
          <option value="Bags">Bags</option>
          <option value="Clothing">Clothing</option>
          <option value="Accessories">Accessories</option>
          <option value="Others">Others</option>
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="">All Status</option>
          <option value="Lost">Lost</option>
          <option value="Found">Found</option>
          <option value="Claimed">Claimed</option>
        </select>

      </div>
    </div>
  );
}

export default LostItemFilters;