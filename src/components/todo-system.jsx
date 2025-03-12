import { useState, useEffect } from "react";

import Input from "./input";
import TodoList from "./todo-list";

import styles from "../styles/app.module.scss";

const TodoSystem = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = () => {
    if (!chrome?.storage?.sync) {
      console.log("Running outside Chrome extension context");
      return;
    }
    chrome.storage.sync.get(["todos"], (result) => {
      setTodos(result.todos || []);
    });
  };

  const saveTodos = (newTodos) => {
    if (!chrome?.storage?.sync) {
      setTodos(newTodos);
      return;
    }
    chrome.storage.sync.set({ todos: newTodos }, () => {
      setTodos(newTodos);
      // Notify content script of top todo
      const topTodo = newTodos
        .filter((t) => !t.completed)
        .sort((a, b) => a.order - b.order)[0];

      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
          if (tab.id) {
            chrome.tabs
              .sendMessage(tab.id, {
                type: "UPDATE_TOP_TODO",
                todo: topTodo,
              })
              .catch(() => {
                /* ignore inactive tabs */
              });
          }
        });
      });
    });
  };

  const addTodo = () => {
    console.log("adding todo now");
    if (!newTodo.trim()) return;

    const todo = {
      id: Date.now(),
      text: newTodo.trim(),
      completed: false,
      order: todos.length,
    };

    saveTodos([...todos, todo]);
    setNewTodo("");
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = () => {
    if (!editText.trim() || !editingId) return;

    const updatedTodos = todos.map((todo) =>
      todo.id === editingId ? { ...todo, text: editText.trim() } : todo
    );

    saveTodos(updatedTodos);
    setEditingId(null);
    setEditText("");
  };

  const toggleTodo = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos(updatedTodos);
  };

  const deleteTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    saveTodos(updatedTodos);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property
    const updatedTodos = items.map((todo, index) => ({
      ...todo,
      order: index,
    }));

    saveTodos(updatedTodos);
  };
  const inputProps = {
    newTodo,
    setNewTodo,
    addTodo,
  };

  const listProps = {
    todos,
    setTodos,
    newTodo,
    setNewTodo,
    editingId,
    setEditingId,
    editText,
    setEditText,
    addTodo,
    startEdit,
    saveEdit,
    toggleTodo,
    deleteTodo,
    onDragEnd,
  };
  return (
    <div className={styles.container}>
      <h1>it's todo o'click</h1>
      <h2>you best be working</h2>
      <Input {...inputProps} />
      <TodoList {...listProps} />
    </div>
  );
};

export default TodoSystem;
