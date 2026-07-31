import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
}

export function Container({
  children,
}: PageContainerProps) {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      {children}
    </div>
  );
}