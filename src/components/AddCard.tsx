import { useState } from "react";
import { FiPlus } from "react-icons/fi";


interface Card {
  title: string;
  id: string;
  column: string;
}


interface AddCardProps {
  column: string;
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
}


export const AddCard: React.FC<AddCardProps> = ({ column, setCards }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");

  const handleAddCard = () => {
    if (!newCardTitle.trim()) return;

    setCards((prevCards) => [
      ...prevCards,
      {
        id: `${Date.now()}`, // Unique ID based on timestamp
        title: newCardTitle.trim(),
        column,
      },
    ]);
    setNewCardTitle("");
    setIsAdding(false);
  };

  return (
    <div className="mt-2">
      {isAdding ? (
        <div className="flex flex-col gap-2">
          <textarea
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            placeholder="Enter task title..."
            autoFocus
            className="w-full rounded border border-blue-400 bg-blue-400/20 p-2 text-sm text-neutral-50 focus:outline-0"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-xs text-neutral-400 hover:text-neutral-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddCard}
              className="rounded bg-blue-500 px-3 py-1.5 text-xs text-white hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center justify-center w-full rounded bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600"
        >
          <FiPlus className="mr-2" /> Add Task
        </button>
      )}
    </div>
  );
};
