import DashboardLayout from "../layouts/DashboardLayout";

function AdminDashboard() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-8 animate-fade-in">
        🛡️ Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="card-red">
          <h2 className="text-xl font-semibold">User Management</h2>
          <p className="text-gray-200 mt-2">
            Manage students and faculty
          </p>
        </div>

        <div className="card-gray">
          <h2 className="text-xl font-semibold">System Reports</h2>
          <p className="text-gray-200 mt-2">
            Analytics and performance
          </p>
        </div>

        <div className="card-orange">
          <h2 className="text-xl font-semibold">Platform Settings</h2>
          <p className="text-gray-200 mt-2">
            Control application behavior
          </p>
        </div>

      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;
