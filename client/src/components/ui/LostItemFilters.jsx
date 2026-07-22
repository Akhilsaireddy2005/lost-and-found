import { HiMagnifyingGlass } from "react-icons/hi2";

function LostItemFilters({
  search,
  setSearch,
  category,
  setCategory,
  status,
  setStatus,
}) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
      <div className="grid md:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        {/* Category */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Documents">Documents</option>
          <option value="Wallet">Wallet</option>
          <option value="Keys">Keys</option>
          <option value="Bags">Bags</option>
          <option value="Clothing">Clothing</option>
          <option value="Accessories">Accessories</option>
          <option value="Books">Books</option>
          <option value="Others">Others</option>
        </select>

        {/* Status */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
        >
          <option value="">All Status</option>
          <option value="Lost">Lost</option>
          <option value="Found">Found</option>
        </select>
      </div>
    </div>
  );
}

export default LostItemFilters;