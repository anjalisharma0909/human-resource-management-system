import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "HRMS - Premium Human Resource Management System",
  description: "A premium HR Management System built with Next.js 15, TypeScript and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-[#080612] text-slate-100">
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'glass-panel text-white border border-white/10',
              style: {
                background: 'rgba(17, 12, 34, 0.85)',
                color: '#fff',
                backdropFilter: 'blur(10px)',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
