import { Folder } from "./components/folder";

import DailyView from "./views/daily-view";
import WeekView from "./views/week-view";

import styles from "./styles/app.module.scss";

function App() {
  return (
    <div className={styles.page}>
      <Folder tab={"daily + weekly"}>
        <div className={styles.weekLayout}>
          <DailyView />
          <WeekView />
        </div>
      </Folder>
    </div>
  );
}

export default App;
