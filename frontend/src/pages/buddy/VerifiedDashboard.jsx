const VerifiedDashboard = ({ buddy }) => {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">
        Welcome {buddy.name} 🎉
      </h1>

      <p className="mt-4 text-gray-600">
        This is your buddy dashboard (dummy).
      </p>
    </div>
  );
};

export default VerifiedDashboard;
