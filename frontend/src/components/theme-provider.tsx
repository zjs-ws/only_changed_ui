"use client";

import { usePathname } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const pathname = usePathname();
  return (
    <NextThemesProvider
      {...props}
      // Default to dark for the "cyberpunk" UI.
      // Users can still override via next-themes (stored preference).
      defaultTheme="dark"
      forcedTheme={pathname === "/" ? "dark" : undefined}
    >
      {children}
    </NextThemesProvider>
  );
}
