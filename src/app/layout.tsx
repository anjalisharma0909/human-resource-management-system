// import { AuthProvider } from "../context/AuthContext"; // Relative path use kiya
// import "./globals.css";

// export const metadata = {
//   title: "HRMS Portal",
//   description: "Next.js 15 Human Resource Management System",
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body className="antialiased">
//         <AuthProvider>
//           {children}
//         </AuthProvider>
//       </body>
//     </html>
//   );

// }



import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

export const metadata = {
  title: "HRMS Portal",
  description: "Next.js 15 Human Resource Management System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}