type AvatarProps = {
  name: string;
  id: number;
};

function Avatar({ name, id }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const colors = [
    "bg-blue-600",
    "bg-orange-600",
    "bg-green-600",
    "bg-red-600",
    "bg-purple-600",
    "bg-cyan-600",
  ];

  const color = colors[id % colors.length];

  return (
    <div
      className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white ${color}`}
    >
      {initials}
    </div>
  );
}

export default Avatar;
