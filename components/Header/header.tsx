import React from "react";
import ConnectButtonCustom from "./connectButtonCustom";
import style from "./connect.module.scss";
import Link from "next/link";

const Header: React.FC = () => {
  return (
    <header className={style.header}>
      <Link href="/">
        <img src="/logo.svg" alt="logo" />
      </Link>
      <div style={{ display: "flex", alignItems: "center" }}>
        <a
          className={style.link}
          href="https://warpcast.com/~/channel/onchaincoin"
          target="_blank"
        >
          WARPCAST
        </a>
        <ConnectButtonCustom />
      </div>
    </header>
  );
};

export default Header;
