import React, { useState, useEffect } from "react";
import { TrackerCell } from "../elements/tracker-cell";

import styles from "./tracker.module.scss"; // Import styles

export default function Tracker({ title, maxCount, icons = [] }) {
  const [trackerState, setTrackerState] = useState([
    ...Array(maxCount).fill(true),
  ]);

  return (
    <div className={styles.tracker}>
      <div>
        <span>{title}</span>
        {icons && icons.length === 1 ? (
          <div>
            {trackerState.map((checked, index) => (
              <TrackerCell
                key={index}
                index={index}
                icon={icons[0].icon}
                checked={checked}
                changeHandler={(index) => {
                  console.log("tracker icon cell clicked", index);
                  setTrackerState((prev) => {
                    console.log(
                      "current state: ",
                      trackerState,
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
        ) : (
          <div>
            {trackerState.map((checked, index) => (
              <TrackerCell
                key={index}
                index={index}
                checked={checked}
                changeHandler={(index) => {
                  console.log("tracker cell clicked", index);
                  setTrackerState((prev) => {
                    console.log(
                      "current state: ",
                      trackerState,
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
        )}
      </div>
    </div>
  );
}
