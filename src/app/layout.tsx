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




// add card from the kanban 
// const AddCard: React.FC<AddCardProps> = ({ column, setCards }) => {
//   const [text, setText] = useState("");
//   const [adding, setAdding] = useState(false);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!text.trim().length) return;

//     const newCard: Card = {
//       column,
//       title: text.trim(),
//       id: Math.random().toString(),
//     };

//     setCards((pv) => [...pv, newCard]);
//     setAdding(false);
//   };

//   return (
//     <>
//     {adding ? (
//       <motion.form layout onSubmit={handleSubmit}>
//         <textarea
//           onChange={(e) => setText(e.target.value)}
//           autoFocus
//           placeholder="Add new task..."
//           className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm text-neutral-50 placeholder-violet-300 focus:outline-0"
//         />
//         <div className="mt-1.5 flex items-center justify-end gap-1.5">
//           <button
//             onClick={() => setAdding(false)}
//             className="px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
//           >
//             Close
//           </button>
//           <button
//             type="submit"
//             className="flex items-center gap-1.5 rounded bg-neutral-50 px-3 py-1.5 text-xs text-neutral-950 transition-colors hover:bg-neutral-300"
//           >
//             <span>Add</span>
//             <FiPlus />
//           </button>
//         </div>
//       </motion.form>
//     ) : (
//       <motion.button
//         layout
//         onClick={() => setAdding(true)}
//         className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
//       >
//         <span>Add card</span>
//         <FiPlus />
//       </motion.button>
//     )}
//   </>
   
//   );
// };


// data to be displayed on the screen 



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