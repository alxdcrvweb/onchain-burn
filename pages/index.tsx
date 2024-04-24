import { FC, useEffect, useState } from "react";
import { observer } from "mobx-react";
import styles from "../styles/presale.module.scss";
import { useInjection } from "inversify-react";
import { Web3Store } from "../stores/Web3Store";
import ConnectButtonCustom from "../components/Header/connectButtonCustom";
import LeftSide from "../components/LeftSide/leftSide";
import RightSide from "../components/RightSide/rightSide";
import { GalleryStore } from "../stores/GalleryStore";
import { chainId } from "../config/config";
const Main: FC = observer((props) => {
  const web3store = useInjection(Web3Store);
  const galleryStore = useInjection(GalleryStore);
  const [modal, setModal] = useState(false);
  useEffect(() => {
    if (web3store.address) {
      galleryStore.getCharacters(web3store.address, chainId).then((res) => {
        galleryStore.setCharacters(res ? res : []);
      });
    }
  }, [web3store.address]);
  useEffect(() => {
    if (web3store.address) {
      // web3store.setAmounts();
    }
  }, [web3store.address]);

  const chose = () => {
    setModal(true);
  };
  return (
    <>
      {!web3store.address ? (
        <div className={styles.container}>
          <ConnectButtonCustom />
        </div>
      ) : !modal ? (
        <div className={styles.container}>
          <div className={styles.chose}>
            <div className={styles.chose_w}>Choose wisely</div>
            <div className={styles.chose_pill}>go to pills traits details</div>
          </div>
          <div className={styles.containerSide}>
            <LeftSide chose={chose} />
            <RightSide />
          </div>
        </div>
      ) : (
        <div className={styles.modal}>
          {galleryStore.characters.map((el, i) => {
            return <div key={i}>{el.id}</div>;
          })}
        </div>
      )}
    </>
  );
});
export default Main;
