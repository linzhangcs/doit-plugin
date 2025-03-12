import styles from "../styles/input.module.scss";

const Input = ({ addTodo, newTodo, setNewTodo }) => {
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

export default Input;
