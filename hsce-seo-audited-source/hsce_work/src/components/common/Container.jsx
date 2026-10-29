import React, { forwardRef } from "react";

export const Container = forwardRef(
  ({ children, className = "", as: Component = "div", ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={`w-full mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8 ${className}`.trim()}
        {...props}>
        {children}
      </Component>
    );
  },
);

Container.displayName = "Container";
