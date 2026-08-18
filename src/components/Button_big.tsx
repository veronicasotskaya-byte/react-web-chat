type ButtonProps = {
  text: string;
  onClick?: () => void;
};

function Button({ text, onClick }: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        inline-flex
        items-center
        justify-center
        rounded-lg
        bg-indigo-600
        px-5
        py-2.5
        text-sm
        font-semibold
        text-white
        shadow-sm
        transition
        hover:bg-indigo-700
        focus:outline-none
        focus:ring-2
        focus:ring-indigo-500
        focus:ring-offset-2
        active:bg-indigo-800
      "
    >
      {text}
    </button>
  );
}

export default Button;
