import { LinkProps, Link as RouterLink } from "react-router-dom";

export function Link({ children, className, ...rest }: LinkProps) {
  return (
    <RouterLink className={`text-blue-500 ${className}`} {...rest}>
      {children}
    </RouterLink>
  );
}
