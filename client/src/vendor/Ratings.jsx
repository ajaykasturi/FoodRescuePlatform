// Ratings Page
const Ratings = () => (
  <div className="flex-1 bg-linear-to-b from-green-50 to-white p-8">
    <h1 className="text-4xl font-bold text-green-900 mb-2 flex items-center gap-2">
      <span>⭐</span> Ratings / Feedback
    </h1>
    <p className="text-green-800 mb-8">
      View ratings and feedback from consumers for your food listings. Helps
      track reliability and trustworthiness.
    </p>

    <div className="mb-8">
      <h2 className="text-2xl font-bold text-green-900 mb-4">Overall Rating</h2>
      <p className="text-lg mb-2 text-green-800">
        Average Rating: ⭐⭐⭐⭐✰ (4.5 / 5)
      </p>
      <p className="text-lg text-green-800">Total Reviews : 12</p>
    </div>

    <div>
      <h2 className="text-2xl font-bold text-green-900 mb-4">
        Recent Feedback:
      </h2>
      <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-green-300">
        <table className="w-full">
          <thead className="border-b-2 border-green-600">
            <tr>
              <th className="text-left py-4 font-bold text-green-900">name</th>
              <th className="text-left py-4 font-bold text-green-900">
                rating
              </th>
              <th className="text-left py-4 font-bold text-green-900">
                feedback
              </th>
              <th className="text-left py-4 font-bold text-green-900">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-green-100 hover:bg-green-50 transition">
              <td className="py-4 text-green-800 font-semibold">@JohnC</td>
              <td className="py-4">⭐⭐⭐⭐</td>
              <td className="py-4 text-gray-900">
                "Veg Sandwich Box was fresh and tasty.
              </td>
              <td className="py-4 text-green-700 font-medium">View</td>
            </tr>
            <tr className="border-b border-green-100 hover:bg-green-50 transition">
              <td className="py-4 text-green-800 font-semibold">@AliceK</td>
              <td className="py-4">⭐⭐⭐⭐⭐</td>
              <td className="py-4 text-gray-900">
                "Pasta Bowl delivered on time. Great!"
              </td>
              <td className="py-4 text-green-700 font-medium">View</td>
            </tr>
            <tr className="hover:bg-green-50 transition">
              <td className="py-4 text-green-800 font-semibold">@FoodieM</td>
              <td className="py-4">⭐⭐⭐</td>
              <td className="py-4 text-gray-900">
                "Bread Loaf Pack could be fresher."
              </td>
              <td className="py-4 text-green-700 font-medium">View</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
export default Ratings;
