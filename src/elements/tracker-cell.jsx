import classNames from "classnames";
import styles from "../styles/elements/tracker-cell.module.scss";

export const TrackerCell = ({ icon = null, checked, changeHandler, index }) => {
  return (
    <>
      <label>
        <input
          key={index}
          type="checkbox"
          checked={checked}
          onChange={() => changeHandler(index)}
          //   className={classNames({ [styles.hidden]: icon })}
        />
        {icon ? <span>{icon}</span> : <span className={styles.checked}> </span>}
      </label>
    </>
  );
};
