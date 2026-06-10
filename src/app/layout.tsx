import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Reparto Gastos',
  description: 'Aplicación de reparto de gastos en tiempo real',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
