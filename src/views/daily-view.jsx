import TodoSystem from "../components/daily/todo-system";
import DailyTrackers from "../components/daily/daily-trackers";

import styles from "../styles/components/daily-view.module.scss";

const DailyView = () => {
  return (
    <section>
      <div className={styles.sectionTab}>
        today: {new Date().toLocaleDateString()}
      </div>
      <div className={styles.sectionCanvas}>
        <TodoSystem />
        <DailyTrackers />
      </div>
    </section>
  );
};

export default DailyView;
