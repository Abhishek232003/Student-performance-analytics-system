function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-8">
      <div
        className="
          w-12 h-12
          border-4
          border-indigo-400
          border-t-transparent
          rounded-full
          animate-spin
          shadow-[0_0_20px_rgba(99,102,241,0.6)]
        "
      ></div>
    </div>
  );
}

export default LoadingSpinner;
