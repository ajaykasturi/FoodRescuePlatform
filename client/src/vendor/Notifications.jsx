// Notifications Page
const Notifications = () => (
  <div className="flex-1 bg-linear-to-b from-green-50 to-white p-8">
    <h1 className="text-4xl font-bold text-green-900 mb-4">Notifications</h1>
    <p className="text-green-800 mb-8">View notifications and alerts</p>

    <div className="space-y-4">
      <div className="bg-linear-to-r from-green-100 to-emerald-100 rounded-2xl p-6 shadow-md flex items-center space-x-3 border-l-4 border-green-600">
        <span className="text-2xl">🔔</span>
        <p className="font-semibold text-green-900">Notification 1</p>
      </div>
      <div className="bg-linear-to-r from-green-100 to-emerald-100 rounded-2xl p-6 shadow-md flex items-center space-x-3 border-l-4 border-green-600">
        <span className="text-2xl">🔔</span>
        <p className="font-semibold text-green-900">
          Notification 2: Platform maintenance scheduled at 10 PM by admin
        </p>
      </div>
      <div className="bg-linear-to-r from-green-100 to-emerald-100 rounded-2xl p-6 shadow-md flex items-center space-x-3 border-l-4 border-green-600">
        <span className="text-2xl">🔔</span>
        <p className="font-semibold text-green-900">
          Notification 3: New order placed by JohnC
        </p>
      </div>
      <div className="bg-linear-to-r from-green-100 to-emerald-100 rounded-2xl p-6 shadow-md flex items-center space-x-3 border-l-4 border-green-600">
        <span className="text-2xl">🔔</span>
        <p className="font-semibold text-green-900">
          Notification 4: John rated your "Veg Sandwich Box"
        </p>
      </div>
      <div className="text-center py-4">
        <p className="text-green-700">.....</p>
      </div>
      <div className="bg-linear-to-r from-green-100 to-emerald-100 rounded-2xl p-6 shadow-md flex items-center space-x-3 border-l-4 border-green-600">
        <span className="text-2xl">🔔</span>
        <p className="font-semibold text-green-900">
          Notification 5: Doe rated your "Non- Veg Sandwich Box"
        </p>
      </div>
    </div>
  </div>
);
export default Notifications;
