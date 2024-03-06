import { ReactNode } from "react";

type FullScreenCardProps = {
  children: ReactNode;
};

export function FullScreenCard({ children }: FullScreenCardProps) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-full">{children}</div>
    </div>
  );
}

// Adjusting the layout for Body and BelowCard components
FullScreenCard.Body = function ({ children }: FullScreenCardProps) {
  return (
    <div className="max-w-full bg-white shadow p-6 rounded-lg">{children}</div>
  );
};

FullScreenCard.BelowCard = function ({ children }: FullScreenCardProps) {
  return (
    <div className="max-w-full mt-2 flex justify-center gap-3">{children}</div>
  );
};
