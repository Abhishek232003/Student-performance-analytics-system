import DashboardLayout from "../layouts/DashboardLayout";

function Requests() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold">Requests</h1>
      <p className="text-gray-400 mt-2">
        Student requests will be listed here.
      </p>
    </DashboardLayout>
  );
}

export default Requests;
