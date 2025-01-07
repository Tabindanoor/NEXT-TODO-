import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "TODO APP",
  description: "Made by Tabinda Noor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

<head>
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}





  // commented code 
  // const handleDragStart = (e: DragEvent<HTMLDivElement>, card: Card) => {
  //   console.log("hanlder dragStart")
  //   e.dataTransfer.setData("cardId", card.id);
  // };

  // const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
  //   const cardId = e.dataTransfer.getData("cardId");
  //   setActive(false);
  //   clearHighlights();

  //   const indicators = getIndicators();
  //   const { element } = getNearestIndicator(e, indicators);

  //   const before = element?.dataset.before || "-1";

  //   if (before !== cardId) {
  //     let copy = [...cards];

  //     let cardToTransfer = copy.find((c) => c.id === cardId);
  //     if (!cardToTransfer) return;
  //     cardToTransfer = { ...cardToTransfer, column };

  //     copy = copy.filter((c) => c.id !== cardId);

  //     const moveToBack = before === "-1";

  //     if (moveToBack) {
  //       copy.push(cardToTransfer);
  //     } else {
  //       const insertAtIndex = copy.findIndex((el) => el.id === before);
  //       if (insertAtIndex === undefined) return;

  //       copy.splice(insertAtIndex, 0, cardToTransfer);
  //     }

  //     setCards(copy);
  //   }
  //   console.log("handling dropend card")
  // };