import type { CSSProperties } from "react";

type ButtonProps = {
  text: string;
  onClick?: () => void;
  style?: CSSProperties;
};

function Button({ text, onClick, style }: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={style}
      className="
        inline-flex
        items-center
        justify-center
        rounded-lg
        border
        border-gray-300
        bg-white
        px-3
        py-2
        text-sm
        font-medium
        text-gray-700
       
        transition
        hover:bg-gray-50
        hover:text-gray-900
        focus:outline-none
        focus:ring-2
        focus:ring-indigo-500
        focus:ring-offset-2
        active:bg-gray-100
      "
    >
      {text}
    </button>
  );
}

export default Button;
