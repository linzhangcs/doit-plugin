import { Module } from "../../elements/module";
import Tracker from "../tracker";

import styles from "../../styles/components/daily-trackers.module.scss";
// import sparkle from "../../assets/daily/sparkle.png";
import sparkle from "../../assets/daily/daily-tracker-bg.png";

const DailyTrackers = () => (
  <Module>
    <div className={styles.header}>
      <img src={sparkle} alt="black outline drawing of a sparkle" />
      <h1>Daily Trackers</h1>
      {/* <Tracker title="water tracker" maxCount={8} icons={["FaTine"]} /> */}
    </div>
  </Module>
);

export default DailyTrackers;
