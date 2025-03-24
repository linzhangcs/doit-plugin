import styles from "../styles/components/folder.module.scss";

export const Folder = ({ tab, children }) => {
  return (
    <div className={styles.folder}>
      <div className={styles.canvas}>{children}</div>
      <div className={styles.tab}>{tab}</div>
    </div>
  );
};
