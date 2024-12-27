"use client"
import { useState, useEffect } from "react";

// Define the type for a to-do item
interface Todo {
  id: number;
  text: string;
}

export default function StoreLocally() {
  const [todos, setTodos] = useState<Todo[]>([]); // Array of todos
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search query
  const [newTodo, setNewTodo] = useState<string>(""); // New todo input
  const [editing, setEditing] = useState<number | null>(null); // ID of the todo being edited
  const [editingText, setEditingText] = useState<string>(""); // Text for editing todo

  // Load todos from localStorage when the component mounts
  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Add a new to-do item
  const addTodo = (): void => {
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo }]);
      setNewTodo("");
    }
  };

  // Delete a to-do item
  const deleteTodo = (id: number): void => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Save edits to a to-do item
  const saveEdit = (): void => {
    setTodos(
      todos.map((todo) =>
        todo.id === editing ? { ...todo, text: editingText } : todo
      )
    );
    setEditing(null);
    setEditingText("");
  };

  // Filter todos based on the search query
  const filteredTodos: Todo[] = todos.filter((todo) =>
    todo.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>To-Do List</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search todos..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "20px" }}
      />

      {/* Add New Todo */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Add new todo..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          style={{ flex: 1, padding: "10px" }}
        />
        <button onClick={addTodo} style={{ padding: "10px" }}>
          Add
        </button>
      </div>

      {/* Todo List */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredTodos.map((todo) => (
          <li
            key={todo.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "5px",
            }}
          >
            {editing === todo.id ? (
              <input
                type="text"
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                style={{ flex: 1, marginRight: "10px", padding: "10px" }}
              />
            ) : (
              <span>{todo.text}</span>
            )}

            <div>
              {editing === todo.id ? (
                <button onClick={saveEdit} style={{ marginRight: "10px" }}>
                  Save
                </button>
              ) : (
                <button
                  onClick={() => {
                    setEditing(todo.id);
                    setEditingText(todo.text);
                  }}
                  style={{ marginRight: "10px" }}
                >
                  Edit
                </button>
              )}
              <button onClick={() => deleteTodo(todo.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {/* No Todos Message */}
      {filteredTodos.length === 0 && <p>No todos found.</p>}
    </div>
  );
}
