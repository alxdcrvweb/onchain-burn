import { FC, RefObject, useEffect, useState } from "react";
// styles
import styles from "../../styles/firstStep.module.scss";
import { getRandomIntInclusive } from "../../utils/utilities";
import { timeToMint } from "../../config/config";


const Timer = () => {
  const [timer, setTimer] = useState<string>("");
  useEffect(() => {
    getTimeRemaining();
    let interval = setInterval(() => {
      getTimeRemaining();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  function getTimeRemaining() {
    
    // const timeToMint = 1709060400000
    const total = timeToMint - Date.now();
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor(total / (1000 * 60 * 60));

    setTimer(
      `${hours < 10 ? "0" + hours : hours}:${
        minutes < 10 ? "0" + minutes : minutes
      }:${seconds < 10 ? "0" + seconds : seconds}`
    );
  }
  // console.log(timer);
  return <div>AVAILABLE IN {timer}</div>;
};

export default Timer;