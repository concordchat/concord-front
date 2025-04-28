type Props = {
  name: string | undefined;
  color?: string;
};

export const UserAvatar = ({ name, color }: Props) => {
  const initial = name ? name[0].toUpperCase() : "?";

  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg transition-all duration-200 hover:scale-105"
      style={{ 
        backgroundColor: color ?? "#34AB70",
        boxShadow: `0 0 0 2px ${color ?? "#34AB70"}20`
      }}
    >
      {initial}
    </div>
  )
}
