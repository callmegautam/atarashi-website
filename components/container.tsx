import type { ElementType, ReactNode } from "react";

export function Container({
  as: Tag = "div",
  className = "",
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag className={`mx-auto w-full max-w-[88rem] px-6 md:px-10 lg:px-14 ${className}`}>
      {children}
    </Tag>
  );
}

export function Grid({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`grid grid-cols-4 gap-x-6 md:grid-cols-8 md:gap-x-8 lg:grid-cols-12 ${className}`}
    >
      {children}
    </div>
  );
}
