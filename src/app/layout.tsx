import type {Metadata} from 'next';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Mega Hacker Virada',
  description: 'Previsões Inteligentes para a Mega da Virada',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased", "min-h-screen bg-black text-primary")}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
