import classNames from "classnames";
import styles from "../styles/elements/cell.module.scss";

export const TrackerCell = ({ icon = null, checked, changeHandler, index }) => {
  return (
    <>
      <label>
        <input
          key={index}
          type="checkbox"
          checked={checked}
          onChange={() => changeHandler(index)}
          className={styles.hidden}
        />
        {icon ? (
          //span with icon passed in styled as icon
          <span
            className={classNames(styles.icon, {
              [styles.checkedIcon]: checked,
            })}
          >
            {icon}
          </span>
        ) : (
          //span without icon passed in styled as cell
          <span
            className={classNames(styles.cell, {
              [styles.checked]: checked,
            })}
          ></span>
        )}
      </label>
    </>
  );
};
