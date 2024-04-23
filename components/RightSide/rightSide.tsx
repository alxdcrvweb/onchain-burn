import * as React from "react";
import style from "./rightSide.module.scss";
function RightSide() {
  return (
    <>
      <div className={style.componentContainer}>
        <div className={style.infoSection}>
          <div className={style.infoWrapper}>
            <div className={style.flexContainer}>
              <div className={style.imageColumn}>
                <div className={style.imageWrapper}>
                  <div className={style.imageContainer}>
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/3f46daee1c1dd8559dbfedaef174e360ee2e1692be6c8bc321f09e254a86e51b?"
                      className={style.mainImage}
                    />
                    <div className={style.statusOverlay}>
                      <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/7b5c6b15644be4c6979859a37380b87d946a3f46a35b547cbaf785ab2c99d2fe?"
                        className={style.statusIcon}
                      />
                      <div className={style.statusText}>Locked</div>
                    </div>
                  </div>
                  <div className={style.availability}>Available later</div>
                </div>
              </div>
              <div className={style.detailsColumn}>
                <div className={style.detailsList}>
                  <div className={style.listItemHeader}>1</div>
                  <div className={style.listItemText}>
                    The size of bag depends on pills traits
                  </div>
                  <div className={style.listItemHeader}>2</div>
                  <div className={style.listItemText}>
                    To get a token bag, you will need to burn your pill after
                    launch
                  </div>
                  <div className={style.listItemHeader}>3</div>
                  <div className={style.listItemText}>
                    The more users pick PFP, the higher is *per-pill* token bag
                    of the rest of users.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={style.launchDate}>Date: tba, after launch</div>
        </div>
      </div>
      <style jsx>{`
        // CSS goes here with classes replaced with style objects
      `}</style>
    </>
  );
}

export default RightSide;