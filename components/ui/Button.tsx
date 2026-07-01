type ButtonProps = {
  text: string;
};

export default function Button({ text }: ButtonProps) {
  return (
    <button
      className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 text-white text-lg font-semibold shadow-lg hover:from-blue-800 hover:to-indigo-800 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
    >
      {text}
    </button>
  );
}
