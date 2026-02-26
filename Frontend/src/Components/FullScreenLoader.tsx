export default function FullScreenLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-navy-dark">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />

        {/* Text */}
        <p className="text-gray-300 text-sm">Loading...</p>
      </div>
    </div>
  );
}
