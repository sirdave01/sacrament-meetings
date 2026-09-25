// Type the children slot supplied by every route in this route group.
import type { ReactNode } from "react";

// Keep the admin route group transparent; individual meeting pages own their UI.
export default function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
	// Return the nested route unchanged because this layout adds no shared wrapper.
	return children;
}
