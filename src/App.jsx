import TodoSystem from "./components/todo-system";
import styles from "./styles/app.module.scss";

function App() {
  return (
    <div className={styles.page}>
      <TodoSystem />
    </div>
  );
}

export default App;
