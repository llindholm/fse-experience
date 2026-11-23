import styles from "./sales.module.css";
export default function SalesLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body style={{margin:0}}><div className={styles.page}>{children}</div></body></html>;}
