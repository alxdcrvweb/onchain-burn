import * as React from "react";
import style from "./leftSide.module.scss";
import Timer from "./timer";
import { timeToMint } from "../../config/config";
function LeftSide({ chose }: { chose: any }) {
  // const [time, setTime] = useState('00.00.00')
  const [timerEnd, setTimerEnd] = React.useState<number>(1);

  
  // const timeToMint = 1709060400000
  React.useEffect(() => {
    let interval = setInterval(() => {
      setTimerEnd(
        timeToMint - Date.now()
      );
    }, 1000);
    return () => {
      clearInterval(interval);
      // clearTimeout(tt);
    };
  }, []);
  return (
    <>
      <section className={style.contentWrapper}>
        <article className={style.contentInner}>
          <div className={style.contentColumns}>
            <div className={style.imageColumn}>
              <img
                loading="lazy"
                src="../../pill.png"
                className={style.responsiveImage}
              />
            </div>
            <div className={style.textColumn}>
              <div className={style.textBlock}>
                <div className={style.textHeader}>1</div>
                <div className={style.textBody}>
                  Prescription Holders have opportunity to make this choice
                  earlier than others.
                </div>
                <div className={style.textHeader}>2</div>
                <div className={style.textBody}>
                  Rarity of PFP traits depends on: <br />— Traits of your pill{" "}
                  <br />— The earlier you make choice in favour of PFP
                </div>
                <div className={style.textHeader}>3</div>
                <div className={style.textBody}>
                  Pfp holders stay participants of onchain ecosystem after token
                  launch{" "}
                </div>
              </div>
            </div>
          </div>
        </article>
        <div className={style.actionPrompt} onClick={() => timerEnd > 0 ? console.log('not yet') : chose()}>
         {timerEnd > 0 ? <Timer/> : 'BURN'}
        </div>
        <div className={style.actionNote}>
          *The earlier you choose pfp, the rarer traits it will hold.{" "}
        </div>
      </section>
    </>
  );
}
export default LeftSide;
