import classNames from "classnames";
import styles from "../styles/elements/module.module.scss";

export const Module = ({ hasBorder, children }) => (
  <div className={classNames(styles.module, { [styles.border]: hasBorder })}>
    {children}
  </div>
);
