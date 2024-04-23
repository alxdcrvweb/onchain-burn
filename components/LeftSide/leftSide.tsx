import * as React from "react";
import style from "./leftSide.module.scss";
function LeftSide({chose}:{chose:any}) {
  
  return (
    <>
      <section className={style.contentWrapper}>
        <article className={style.contentInner}>
          <div className={style.contentColumns}>
            <div className={style.imageColumn}>
              <img
                loading="lazy"
                src='../../pill.png'
                className={style.responsiveImage}
              />
            </div>
            <div className={style.textColumn}>
              <div className={style.textBlock}>
                <div className={style.textHeader}>1</div>
                <div className={style.textBody}>
                  Pfp traits rarity depends on: <br />— pills traits— line of
                  choice makers*{" "}
                </div>
                <div className={style.textHeader}>2</div>
                <div className={style.textBody}>
                  Pfp holders stay participants of onchain ecosystem after token
                  launch{" "}
                </div>
              </div>
            </div>
          </div>
        </article>
        <div className={style.actionPrompt} onClick={chose}>choose pfp</div>
        <div className={style.actionNote}>
          *The earlier you choose pfp, the rarer traits it will hold.{" "}
        </div>
      </section>
    </>
  );
}
export default LeftSide;
