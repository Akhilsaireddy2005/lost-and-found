import { useState } from "react";
import MainLayout from "../../layouts/MainLayout";

function CreateLostItem() {
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [dateLost, setDateLost] = useState("");
  const [image, setImage] = useState(null);

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-100 py-12 px-4">
        <div className="w-full">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">

            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800">
                📦 Report Lost Item
              </h1>

              <p className="text-gray-600 mt-2">
                Fill in the details below to report your lost item.
              </p>
            </div>

            <form className="space-y-6">

              {/* Item Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Item Name
                </label>

                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="Enter item name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>

                <textarea
                  rows="5"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your lost item..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* Category & Date */}
              <div className="grid md:grid-cols-2 gap-6">

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>

                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="">Select Category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Documents">Documents</option>
                    <option value="Wallet">Wallet</option>
                    <option value="Keys">Keys</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Books">Books</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date Lost
                  </label>

                  <input
                    type="date"
                    value={dateLost}
                    onChange={(e) => setDateLost(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>

              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Lost Location
                </label>

                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter location where item was lost"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* Upload Image */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Upload Image
                </label>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition">

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="w-full hidden"
                    id="file-input"
                  />
                  
                  <label htmlFor="file-input" className="cursor-pointer block">
                    <p className="text-gray-600">Click to upload an image</p>
                  </label>

                  <p className="text-xs text-gray-500 mt-2">
                    JPG, PNG, JPEG (Max 5MB)
                  </p>

                  {image && (
                    <div className="mt-3 text-green-600">
                      <p className="font-medium">Selected: {image.name}</p>
                    </div>
                  )}

                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
              >
                Report Lost Item
              </button>

            </form>

          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default CreateLostItem;