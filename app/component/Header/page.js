"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../Header/page.module.css";
import Image from "next/image";

export default function Header() {
  const [menuActive, setMenuActive] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Detect screen size to toggle hamburger menu functionality
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 628);
    };

    // Initialize state
    handleResize();

    // Attach listener
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleMouseEnter = () => {
    if (isSmallScreen) {
      setHovering(true);
    }
  };

  const handleMouseLeave = () => {
    if (isSmallScreen) {
      setHovering(false);
    }
  };

  const toggleMenu = () => {
    if (isSmallScreen) {
      setMenuActive(!menuActive);
    }
  };

  return (
    <div className={styles.header}>
      <Link href={"/"}>
        <div className={styles.name}>
          <Image
            src="/image/rt.png"
            width={39}
            height={39}
            alt="logo"
            className={styles.logoformat}
          />
          <p className={styles.baggyt}>Keeper App</p>
        </div>
      </Link>
      {isSmallScreen ? (
        <>
          <div className={styles.menu}>
            {/* <div>Menu</div> */}
            <div
              className={styles.hamburger}
              onClick={toggleMenu}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className={styles.bar}></div>
              <div className={styles.bar}></div>
              <div className={styles.bar}></div>
            </div>
          </div>
          <div
            className={`${styles.end} ${
              menuActive || hovering ? styles.showMenu : ""
            }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className={styles.create}>
              <Link href={"/../pos"}>Pos Transactions</Link>
            </div>
            <div className={styles.create}>
              <Link href={"/../sold"}>Sold products</Link>
            </div>
            <div className={styles.create}>
              <Link href={"/../expenses"}>Expenditure</Link>
            </div>
          </div>
        </>
      ) : (
        <div className={styles.end}>
          <div className={styles.create}>
            <Link href={"/../pos"}>Pos Transactions</Link>
          </div>
          <div className={styles.create}>
            <Link href={"/../sold"}>Sold products</Link>
          </div>
          <div className={styles.create}>
            <Link href={"/../expenses"}>Expenditure</Link>
          </div>
        </div>
      )}
    </div>
  );
}
