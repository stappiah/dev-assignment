import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
}

export function Card({ children }: CardProps) {
  return (
    <div className="border border-gray-200 rounded-lg shadow-lg p-6 bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out">
      {children}
    </div>
  );
}

export function CardContent({ children }: CardProps) {
  return <div className="p-4 font-medium">{children}</div>;
}
