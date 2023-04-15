import type { ReactNode } from "react";

type ButtonProps = { 
  children: ReactNode;
  onClick: () => void;
  disabled: boolean;
};
const Button = ({ children, onClick, disabled }: ButtonProps) => (
  <button
    onClick={onClick}
    className='bg-sky-800 text-medium rounded-lg px-4 py-2 disabled:opacity-30'
    disabled={disabled}
  >
    {children}   
  </button>
)

export default Button