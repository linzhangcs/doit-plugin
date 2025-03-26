import React, { useState, useEffect } from "react";
import { TrackerCell } from "../elements/tracker-cell";

import styles from "../styles/components/tracker.module.scss"; // Import styles

export default function Tracker({
  title,
  maxCount,
  icons = null,
  type = "checkbox",
}) {
  const [trackerState, setTrackerState] = useState([
    ...Array(maxCount).fill(false),
  ]);

  return (
    <div className={styles.tracker}>
      <span>{title}</span>
      {
        // icons && icons.length === 1 && (
        <div className={styles.cells}>
          {trackerState.map((checked, index) => (
            <TrackerCell
              key={index}
              index={index}
              icon={icons && icons[0].icon}
              checked={checked}
              changeHandler={(index) => {
                console.log("tracker icon cell clicked", index);
                setTrackerState((prev) => {
                  console.log(
                    "current state: ",
                    trackerState,
                    checked,
                    "checked: ",
                    trackerState.filter((c) => c).length
                  );
                  return prev.map((cellState, i) =>
                    i === index ? !cellState : cellState
                  );
                });
              }}
            />
          ))}
        </div>
        // )
      }
    </div>
  );
}
