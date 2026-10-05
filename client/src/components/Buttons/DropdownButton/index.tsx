import { cn } from "@/utils/stringUtils";

export default function DropdownButton({
  children,
  onClick,
  className,
  ...props
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) {
  const baseCn = cn(
    "relative px-1.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 justify-between lg:justify-normal border",
    "bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow-sm"
  );
  return (
    <button
      onClick={onClick}
      className={cn(baseCn, className)}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}
