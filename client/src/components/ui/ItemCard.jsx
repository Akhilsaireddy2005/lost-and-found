import { Link } from "react-router-dom";

function ItemCard({ item }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">

      <img
        src={item.image || "/placeholder.png"}
        alt={item.itemName}
        className="w-full h-52 object-cover"
      />

      <div className="p-5">

        <h2 className="text-xl font-bold">
          {item.itemName}
        </h2>

        <p className="text-gray-600 mt-2">
          {item.description}
        </p>

        <div className="mt-4 flex justify-between items-center">

          <span className="text-sm text-gray-500">
            {item.location}
          </span>

          <Link
            to={`/lost-items/${item._id}`}
            className="text-blue-600 font-semibold"
          >
            View Details
          </Link>

        </div>

      </div>

    </div>
  );
}

export default ItemCard;