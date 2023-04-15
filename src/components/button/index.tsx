import type { ReactNode } from "react";

type ButtonProps = { 
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};
const Button = ({ className, children, onClick, disabled }: ButtonProps) => (
  <button
    onClick={onClick}
    className={`bg-sky-800 text-medium rounded-lg px-4 py-2 disabled:opacity-30 ${className}`}
    disabled={disabled}
  >
    {children}   
  </button>
)

export default Button