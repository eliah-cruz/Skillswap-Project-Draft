export default function Loader() {
  return (
    <div className="flex flex-row gap-2 justify-center items-center">
      <div className="w-4 h-4 rounded-full bg-indigo-500 animate-bounce"></div>
      <div className="w-4 h-4 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-4 h-4 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.5s]"></div>
    </div>
  );
}