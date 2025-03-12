import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import styles from "../styles/app.module.scss";

const TodoList = ({
  onDragEnd,
  todos,
  toggleTodo,
  setEditText,
  saveEdit,
  startEdit,
  deleteTodo,
  editingId,
  setEditingId,
  editText,
}) => {
  return (
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
                            onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                            autoFocus
                          />
                        ) : (
                          <span
                            className={todo.completed ? styles.completed : ""}
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
                        <button onClick={() => deleteTodo(todo.id)}>×</button>
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
  );
};

export default TodoList;
