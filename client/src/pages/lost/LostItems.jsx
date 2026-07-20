import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import ItemCard from "../../components/ui/ItemCard";
import LostItemFilters from "../../components/ui/LostItemFilters";
import { getLostItems } from "../../services/lostItemService";

function LostItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [search, category, status]);

  useEffect(() => {
    fetchLostItems();
  }, [search, category, status, page]);

  const fetchLostItems = async () => {
    setLoading(true);

    try {
      const response = await getLostItems({
        search,
        category,
        status,
        page,
        limit: 9,
      });

      setItems(response.data.items || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error(error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-4xl font-bold text-gray-800">
          Lost Items
        </h1>

        <Link
          to="/lost-items/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
        >
          + Report Lost Item
        </Link>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto">
        <LostItemFilters
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          status={status}
          setStatus={setStatus}
        />
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[60vh]">
          <p className="text-lg font-semibold text-gray-600">
            Loading lost items...
          </p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">

          {items.length === 0 ? (

            <div className="flex justify-center items-center min-h-[55vh]">
              <div className="bg-white shadow-xl border rounded-2xl p-12 w-full max-w-xl text-center">

                <div className="text-7xl mb-5">
                  🔍
                </div>

                <h2 className="text-4xl font-bold text-gray-800 mb-4">
                  No Lost Items Found
                </h2>

                <p className="text-gray-500 text-lg leading-8 mb-8">
                  We couldn't find any items matching your search or
                  filters.
                </p>

                <button
                  onClick={() => {
                    setSearch("");
                    setCategory("");
                    setStatus("");
                  }}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  Clear Filters
                </button>

              </div>
            </div>

          ) : (

            <>
              {/* Grid */}
              <div className="grid gap-8 justify-items-center sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <ItemCard
                    key={item._id}
                    item={item}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-wrap justify-center items-center gap-3 mt-10">

                  <button
                    onClick={() => setPage((prev) => prev - 1)}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                  >
                    Previous
                  </button>

                  {Array.from(
                    { length: totalPages },
                    (_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => setPage(index + 1)}
                        className={`px-4 py-2 rounded-lg transition ${
                          page === index + 1
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                      >
                        {index + 1}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={page === totalPages}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                  >
                    Next
                  </button>

                </div>
              )}
            </>
          )}
        </div>
      )}
    </MainLayout>
  );
}

export default LostItems;