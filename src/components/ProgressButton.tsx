const ProgressButton = ({ onClick, progress, children }) => {
  const baseClasses =
    "block relative text-center text-xl md:text-2xl p-4 md:p-6 mx-auto w-full max-w-md rounded-full shadow-lg transition-transform duration-300 transform hover:scale-105 focus:outline-none";
  const spanClasses = "absolute inset-0 rounded-full overflow-hidden";
  const progressClasses =
    "absolute inset-0 origin-left bg-opacity-50 transition-transform ease-linear duration-700";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseClasses} bg-blue-600 hover:bg-blue-500 focus:bg-blue-500`}
    >
      <span className={`${spanClasses} bg-blue-400 bg-opacity-25`}>
        <span
          className={`${progressClasses} bg-blue-800`}
          style={{ transform: `scaleX(${progress / 100})` }}
        ></span>
      </span>
      <span className="relative">{children}</span>
    </button>
  );
};

export default ProgressButton;
