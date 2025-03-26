import React, { useState, useEffect } from "react";
import { SelectorCell } from "../elements/selector-cell";

import styles from "../styles/components/tracker.module.scss"; // Import styles

export default function Selector({ title, options }) {
  const [selectedOption, setSelectedOption] = useState(0);

  return (
    <div className={styles.tracker}>
      <span>{title}</span>
      {
        <div className={styles.cells}>
          {options.map((option, index) => (
            <SelectorCell
              key={index}
              index={index}
              value={option.value}
              icon={option.icon}
              checked={selectedOption === option.value}
              changeHandler={(index) => {
                console.log("selector icon cell clicked", index);
                setSelectedOption(option.value);
              }}
            />
          ))}
        </div>
      }
    </div>
  );
}
