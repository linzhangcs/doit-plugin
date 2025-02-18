import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import styles from "./App.module.scss";

function App() {
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

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1>Todo List</h1>

        <div className={styles.inputContainer}>
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            placeholder="Add a new todo"
          />
          <button onClick={addTodo}>Add</button>
        </div>

        <div className={styles.todoListContainer}>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable-1" type="TASK">
              {(droppableProvided) => (
                <ul
                  {...droppableProvided.droppableProps}
                  ref={droppableProvided.innerRef}
                  className={styles.todoList}
                >
                  {[...todos]
                    .sort((a, b) => a.order - b.order)
                    .map((todo, index) => (
                      <Draggable
                        key={todo.id}
                        draggableId={todo.id.toString()}
                        index={index}
                        type="TASK"
                      >
                        {(draggableProvided, snapshot) => (
                          <li
                            ref={draggableProvided.innerRef}
                            {...draggableProvided.draggableProps}
                            className={`${styles.todoItem} ${
                              snapshot.isDragging ? styles.dragging : ""
                            }`}
                          >
                            <span
                              className={styles.rank}
                              {...draggableProvided.dragHandleProps}
                            >
                              {index + 1}
                            </span>
                            <input
                              type="checkbox"
                              checked={todo.completed}
                              onChange={() => toggleTodo(todo.id)}
                            />
                            {editingId === todo.id ? (
                              <input
                                type="text"
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                onBlur={saveEdit}
                                onKeyDown={(e) =>
                                  e.key === "Enter" && saveEdit()
                                }
                                autoFocus
                              />
                            ) : (
                              <span
                                className={
                                  todo.completed ? styles.completed : ""
                                }
                                onDoubleClick={() => startEdit(todo)}
                              >
                                {todo.text}
                              </span>
                            )}
                            <button
                              onClick={() => startEdit(todo)}
                              className={styles.editButton}
                            >
                              ✎
                            </button>
                            <button onClick={() => deleteTodo(todo.id)}>
                              ×
                            </button>
                          </li>
                        )}
                      </Draggable>
                    ))}
                  {droppableProvided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
}

export default App;
