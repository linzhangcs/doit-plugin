import TodoSystem from "../components/daily/todo-system";
// import DailyTrackers from "../components/daily/daily-trackers";
import Tracker from "../components/tracker";
import { FaTint } from "react-icons/fa"; // Water drop icon
import { FaSmile, FaMeh, FaFrown } from "react-icons/fa"; // Emojis
import styles from "../styles/components/daily-view.module.scss";
import DailyTrackers from "../components/daily/daily-trackers";

const DailyView = () => {
  // const stressLevels = [
  //   { id: 1, icon: <FaSmile className="text-yellow-400" />, label: "Happy" },
  //   { id: 2, icon: <FaSmile />, label: "Content" },
  //   { id: 3, icon: <FaMeh />, label: "Neutral" },
  //   { id: 4, icon: <FaFrown />, label: "Sad" },
  //   { id: 5, icon: <FaFrown className="text-gray-500" />, label: "Very Sad" },
  // ];

  const waterIcon = [{ icon: <FaTint /> }];

  return (
    <section>
      <div className={styles.sectionTab}>
        today: {new Date().toLocaleDateString()}
      </div>
      <div className={styles.sectionCanvas}>
        <TodoSystem />
        <DailyTrackers />
        <Tracker title="Water Tracker" maxCount={8} icons={waterIcon} />
        <Tracker title="Workout Tracker" maxCount={7} />
      </div>
    </section>
  );
};

export default DailyView;
