import classNames from "classnames";
import styles from "../styles/elements/cell.module.scss";

export const SelectorCell = ({
  icon = null,
  value,
  changeHandler,
  checked = false,
  index,
}) => {
  return (
    <>
      <label>
        <input
          key={index}
          type="radio"
          value={value}
          checked={checked}
          onChange={() => changeHandler(index)}
          className={styles.hidden}
        />

        <span
          className={classNames(styles.icon, {
            [styles.checkedIcon]: checked,
          })}
        >
          {icon}
        </span>
      </label>
    </>
  );
};
