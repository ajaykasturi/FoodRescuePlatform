import { useState } from "react";
// Add Food Listing Page
const AddListing = () => {
  const [formData, setFormData] = useState({
    details: "",
    price: "",
    location: "",
    brand: "",
    expiry: "",
    bags: "",
    category: "",
  });

  return (
    <div className="flex-1 bg-linear-to-b from-green-50 to-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-green-900 mb-8">
          Please enter the details of your surplus food item:
        </h1>

        <div className="space-y-6">
          <div>
            <label className="block text-green-900 font-semibold mb-2">
              Food details like what is included *
            </label>
            <input
              type="text"
              placeholder="Enter details"
              value={formData.details}
              onChange={(e) =>
                setFormData({ ...formData, details: e.target.value })
              }
              className="w-full px-6 py-4 bg-white rounded-2xl text-gray-900 border-2 border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-green-900 font-semibold mb-2">
              Price *
            </label>
            <input
              type="text"
              placeholder="Enter price of the food"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="w-full px-6 py-4 bg-white rounded-2xl text-gray-900 border-2 border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-green-900 font-semibold mb-2">
              Pickup Location *
            </label>
            <input
              type="text"
              placeholder="Enter pickup location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full px-6 py-4 bg-white rounded-2xl text-gray-900 border-2 border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-green-900 font-semibold mb-2">
              Do you want to show your brand name
            </label>
            <input
              type="text"
              placeholder="Yes or No"
              value={formData.brand}
              onChange={(e) =>
                setFormData({ ...formData, brand: e.target.value })
              }
              className="w-full px-6 py-4 bg-white rounded-2xl text-gray-900 border-2 border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-green-900 font-semibold mb-2">
              Expiry Date and Time
            </label>
            <input
              type="text"
              placeholder="Enter expiry date and time"
              value={formData.expiry}
              onChange={(e) =>
                setFormData({ ...formData, expiry: e.target.value })
              }
              className="w-full px-6 py-4 bg-white rounded-2xl text-gray-900 border-2 border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-green-900 font-semibold mb-2">
              No. of Bags *
            </label>
            <input
              type="text"
              placeholder="Enter how many bags you can serve"
              value={formData.bags}
              onChange={(e) =>
                setFormData({ ...formData, bags: e.target.value })
              }
              className="w-full px-6 py-4 bg-white rounded-2xl text-gray-900 border-2 border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-green-900 font-semibold mb-2">
              Category
            </label>
            <input
              type="text"
              placeholder="Food or grocery"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-6 py-4 bg-white rounded-2xl text-gray-900 border-2 border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
            />
          </div>

          <button className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold text-xl hover:bg-green-700 transition shadow-lg">
            submit
          </button>
        </div>

        <div className="mt-8 space-y-2">
          <p className="text-green-900">
            <strong>Outcome:</strong> Once submitted, your food post becomes
            visible to nearby consumers in real time.
          </p>
          <p className="text-green-900">
            <strong>Tip:</strong> Ensure accurate expiry date and location for
            safety.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddListing;
