import styles from "../../styles/components/todo.module.scss";

const TodoInput = ({ addTodo, newTodo, setNewTodo }) => {
  return (
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
  );
};

export default TodoInput;
