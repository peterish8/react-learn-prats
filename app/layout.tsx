import type { ReactNode } from 'react';
import '../src/styles.css';

export const metadata = {
  title: "React Reset — Prathick's React Learning Journey",
  description: "A 45-day visual React learning system with quizzes, progress tracking, review, and playground."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
