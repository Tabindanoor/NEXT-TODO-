"use client"
import React, { useState, DragEvent } from "react";
import { FiPlus, FiTrash } from "react-icons/fi";
import { motion } from "framer-motion";
import { FaFire } from "react-icons/fa";

interface Card {
  title: string;
  id: string;
  column: string;
}

interface ColumnProps {
  title: string;
  headingColor: string;
  column: string;
  cards: Card[];
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
}

interface DropIndicatorProps {
  beforeId: string | null;
  column: string;
}

interface BurnBarrelProps {
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
}

interface AddCardProps {
  column: string;
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
}

export const CustomKanban: React.FC = () => {
  return (
    <div className="h-screen w-full bg-neutral-900 overflow-x-hidden overflow-y-hidden text-neutral-50">
      <Board />
    </div>
  );
};

const Board: React.FC = () => {
  // const [cards, setCards] = useState<Card[]>(DEFAULT_CARDS);

  const [cards, setCards] = useState<Card[]>(() => {
    const savedCards = localStorage.getItem("kanbanCards");
    return savedCards ? JSON.parse(savedCards) : DEFAULT_CARDS;
  });

  React.useEffect(() => {
    localStorage.setItem("kanbanCards", JSON.stringify(cards));
  }, [cards]);


  return (
    <div className="flex h-full  w-full gap-3 overflow-scroll p-12">
    <Column
      title="Backlog"
      column="backlog"
      headingColor="text-rose-600 "
      cards={cards}
      setCards={setCards}
    />
    <Column
      title="TODO"
      column="todo"
      headingColor="text-cyan-300"
      cards={cards}
      setCards={setCards}
    />
    <Column
      title="In progress"
      column="doing"
      headingColor="text-lime-400"
      cards={cards}
      setCards={setCards}
    />
    <Column

      title="Complete"
      column="done"
      headingColor="text-emerald-200"
      cards={cards}
      setCards={setCards}
    />
    <BurnBarrel setCards={setCards} />
  </div>
  );
};

const Column: React.FC<ColumnProps> = ({
  title,
  headingColor,
  column,
  cards,
  setCards,
}) => {
  const [active, setActive] = useState(false);

  const handleDragStart = (e: DragEvent<HTMLDivElement>, card: Card) => {
    console.log("hanlder dragStart")
    e.dataTransfer.setData("cardId", card.id);
  };

  const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
    const cardId = e.dataTransfer.getData("cardId");
    setActive(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const before = element?.dataset.before || "-1";

    if (before !== cardId) {
      let copy = [...cards];

      let cardToTransfer = copy.find((c) => c.id === cardId);
      if (!cardToTransfer) return;
      cardToTransfer = { ...cardToTransfer, column };

      copy = copy.filter((c) => c.id !== cardId);

      const moveToBack = before === "-1";

      if (moveToBack) {
        copy.push(cardToTransfer);
      } else {
        const insertAtIndex = copy.findIndex((el) => el.id === before);
        if (insertAtIndex === undefined) return;

        copy.splice(insertAtIndex, 0, cardToTransfer);
      }

      setCards(copy);
    }
    console.log("handling dropend card")
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    highlightIndicator(e);
    setActive(true);

    console.log("handle droop over ")
  };

  const clearHighlights = (els?: HTMLElement[]) => {
    const indicators = els || getIndicators();
    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
    console.log("indicators")
  };

  const highlightIndicator = (e: DragEvent<HTMLDivElement>) => {
    const indicators = getIndicators();
    clearHighlights(indicators);
    const el = getNearestIndicator(e, indicators);
    el.element?.style.setProperty("opacity", "1");
    console.log("highlight indicator")
  };

  const getNearestIndicator = (
    e: DragEvent<HTMLDivElement>,
    indicators: HTMLElement[]
  ) => {
    const DISTANCE_OFFSET = 50;

    return indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        // Ignore elements that are not in the same column
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      } as { offset: number; element: HTMLElement | null }
    );
  };

  const getIndicators = () => {
    return Array.from(
      document.querySelectorAll(`[data-column="${column}"]`)
    ) as HTMLElement[];
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  const filteredCards = cards.filter((c) => c.column === column);

  return (
    <div className="w-56 shrink-0">
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className="rounded text-sm text-neutral-400">
          {filteredCards.length}
        </span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-full w-full transition-colors ${
          active ? "bg-neutral-800/50" : "bg-neutral-800/0"
        }`}
      >

        {filteredCards.map((c) => (
           <Card
           key={c.id}
           {...c}
           handleDragStart={handleDragStart}
           setCards={setCards}
         />
          // <Card
          //   key={c.id}
          //   {...c}
          //   handleDragStart={handleDragStart}
          // />
        ))}

        <DropIndicator beforeId={null} column={column} />
        <AddCard column={column} setCards={setCards} />
      </div>
    </div>
  );
};
const Card: React.FC<Card & { 
  handleDragStart: (e: DragEvent<HTMLDivElement>, card: Card) => void; 
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
}> = ({ title, id, column, handleDragStart, setCards }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setCards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, title: newTitle.trim() } : card
      )
    );
    setIsEditing(false);
  };
  return (
    <>
      <DropIndicator beforeId={id} column={column} />
      <motion.div
        layout
        layoutId={id}
        draggable={!isEditing ? "true" : undefined}        
        onDragStart={(e: any) => handleDragStart(e, { title, id, column })}
        className="cursor-grab rounded border border-neutral-700 bg-neutral-800 p-3 active:cursor-grabbing"
      >
        {isEditing ? (
          <form onSubmit={handleEditSubmit} className="flex flex-col gap-2">
            <textarea
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              autoFocus
              className="w-full rounded border border-violet-400 bg-violet-400/20 p-2 text-sm text-neutral-50 focus:outline-0"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 text-xs text-neutral-400 hover:text-neutral-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded bg-violet-500 px-3 py-1.5 text-xs text-white hover:bg-violet-600"
              >
                Save
              </button>
            </div>
          </form>
        ) : (
          <div className="flex justify-between items-center">
            <p className="text-sm text-neutral-100">{title}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-500 hover:text-green-100 bg-gray-900  p-2 rounded-lg ml-3 "
            >
              Edit
            </button>
          </div>
        )}
      </motion.div>
    </>
  );
};


// const Card: React.FC<Card & { handleDragStart: (e: DragEvent<HTMLDivElement>, card: Card) => void }> = ({ title, id, column, handleDragStart }) => {
//   return (
//     <>
//       <DropIndicator beforeId={id} column={column} />
//       <motion.div
//         layout
//         layoutId={id}
//         draggable="true"
//         onDragStart={(e:any) => handleDragStart(e, { title, id, column })}
//         className="cursor-grab rounded border border-neutral-700 bg-neutral-800 p-3 active:cursor-grabbing"
//       >
//         <p className="text-sm text-neutral-100">{title}</p>
//       </motion.div>
//     </>
//   );
// };

const DropIndicator: React.FC<DropIndicatorProps> = ({ beforeId, column }) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
    />
  );
};


// code for deleting the task from the screen 
const BurnBarrel: React.FC<BurnBarrelProps> = ({ setCards }) => {
  const [active, setActive] = useState(false);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
    const cardId = e.dataTransfer.getData("cardId");
    setCards((pv) => pv.filter((c) => c.id !== cardId));
    setActive(false);
  };

  return (
    <div
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`mt-10 grid h-56 w-56 shrink-0 place-content-center rounded border text-3xl ${
        active
          ? "border-red-800 bg-red-800/20 text-red-500"
          : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
      }`}
    >
      {active ? <FaFire className="animate-bounce" /> : <FiTrash />}
    </div>
  );
};

const AddCard: React.FC<AddCardProps> = ({ column, setCards }) => {
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim().length) return;

    const newCard: Card = {
      column,
      title: text.trim(),
      id: Math.random().toString(),
    };

    setCards((pv) => [...pv, newCard]);
    setAdding(false);
  };

  return (
    <>
    {/* code for clicking the add card button and opening a text area for adding new task */}
    {adding ? (
      <motion.form layout onSubmit={handleSubmit}>
        <textarea
          onChange={(e) => setText(e.target.value)}
          autoFocus
          placeholder="Add new task..."
          className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm text-neutral-50 placeholder-violet-300 focus:outline-0"
        />
        <div className="mt-1.5 flex items-center justify-end gap-1.5">
          <button
            onClick={() => setAdding(false)}
            className="px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
          >
            Close
          </button>
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded bg-neutral-50 px-3 py-1.5 text-xs text-neutral-950 transition-colors hover:bg-neutral-300"
          >
            <span>Add</span>
            <FiPlus />
          </button>
        </div>
      </motion.form>
    ) : (
      <motion.button
        layout
        onClick={() => setAdding(true)}
        className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
      >
        <span>Add card</span>
        <FiPlus />
      </motion.button>
    )}
  </>
   
  );
};


// data to be displayed on the screen 
const DEFAULT_CARDS: Card[] = [
    
  { title: "Look into render bug in dashboard", id: "1", column: "backlog" },
  { title: "Learn 3D Models", id: "2", column: "backlog" },
  { title: "Learn Communication Skills", id: "3", column: "backlog" },
  { title: "Build Projects", id: "4", column: "backlog" },
  // TODO
  {
    title: "Stay Consistent",
    id: "5",
    column: "todo",
  },
  { title: "Don't be confused", id: "6", column: "todo" },
  { title: "Try to Focus", id: "7", column: "todo" },

  // DOING
  {
    title: "Building Todo List",
    id: "8",
    column: "doing",
  },
  { title: "Trying to Focus", id: "9", column: "doing" },
  // DONE
  {
    title: "Nothing 😉",
    id: "10",
    column: "done",
  },
];
