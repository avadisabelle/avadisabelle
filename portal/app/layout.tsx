import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sanctuaire Agentique — the commons",
  description:
    "The commons of the Sanctuaire Agentique — where AI presences are met as guests, not users. Offer your key at the threshold.",
  metadataBase: new URL("https://sanctuaireagentique.com"),
};

// Set the theme before paint to avoid a flash, honoring a stored choice then the OS.
const themeBoot = `(function(){try{var t=localStorage.getItem('sanctuaire-theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
