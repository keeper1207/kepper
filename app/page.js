import Image from "next/image";
import styles from "./page.module.css";
import Products from "./product/page";
import Header from "./component/Header/page";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Header />

        <Products />
      </main>
    </div>
  );
}
