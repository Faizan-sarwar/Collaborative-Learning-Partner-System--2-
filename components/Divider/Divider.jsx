import styles from './Divider.module.css';

const Divider = ({ text }) => {
  return (
    <div className={styles.divider}>
      <div className={styles.line}></div>
      {text && <span className={styles.text}>{text}</span>}
      <div className={styles.line}></div>
    </div>
  );
};

export default Divider;
