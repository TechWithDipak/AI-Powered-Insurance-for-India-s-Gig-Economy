import './globals.css';

export const metadata = {
  title: 'DropSure Demo',
  description: 'AI-Powered Parametric Insurance for Gig Workers',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
