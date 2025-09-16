// src/app/[...slug]/layout.tsx
import { ReactNode } from 'react';

interface DynamicLayoutProps {
	children: ReactNode;
}

export default function DynamicLayout({ children }: DynamicLayoutProps) {
	return children;
}
