import Tracker from "../tracker";
import Selector from "../selector";
import { Module } from "../../elements/module";

import sparkle from "../../assets/daily/daily-tracker-bg.png";
import { FaTint } from "react-icons/fa"; // Water drop icon
import { FaSmile, FaMeh, FaFrown } from "react-icons/fa"; // Emojis

import styles from "../../styles/components/daily-trackers.module.scss";

const DailyTrackers = () => {
  const waterGoal = 8;
  const waterIcon = [{ icon: <FaTint /> }];
  const stressLevels = [
    { value: 5, icon: <FaSmile className="text-yellow-400" />, label: "Happy" },
    { value: 4, icon: <FaSmile />, label: "Content" },
    { value: 3, icon: <FaMeh />, label: "Neutral" },
    { value: 2, icon: <FaFrown />, label: "Sad" },
    {
      value: 1,
      icon: <FaFrown className="text-gray-500" />,
      label: "Very Sad",
    },
  ];
  return (
    <Module>
      <div className={styles.layout}>
        <div className={styles.header}>
          <img src={sparkle} alt="black outline drawing of a sparkle" />
          <h1>Daily Trackers</h1>
        </div>
        <div className={styles.trackers}>
          <Selector title="Morning stress" options={stressLevels} />
          <Tracker title="Water" maxCount={waterGoal} icons={waterIcon} />
          <Tracker title="Workout" maxCount={7} />
        </div>
      </div>
    </Module>
  );
};
export default DailyTrackers;
