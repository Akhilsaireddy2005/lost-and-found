function StatCard({ title, value, color, icon, bg }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
      {icon && (
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${bg || "bg-blue-50"}`}>
          {icon}
        </div>
      )}
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h2 className={`text-3xl font-bold mt-0.5 ${color}`}>{value}</h2>
      </div>
    </div>
  );
}

export default StatCard;