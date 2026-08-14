import "../styles/Button_small.css";

type ButtonProps = {
  text: string;
  onClick?: () => void;
  style?: React.CSSProperties;
};

function Button({ text, onClick, style }: ButtonProps) {
  return (
    <button className="secondary-button" onClick={onClick} style={style}>
      {text}
    </button>
  );
}

export default Button;
