import { FC, useEffect } from "react";
import { observer } from "mobx-react";
import styles from "../styles/presale.module.scss";
import { useInjection } from "inversify-react";
import { Web3Store } from "../stores/Web3Store";
import ConnectButtonCustom from "../components/Header/connectButtonCustom";
import { GalleryStore } from "../stores/GalleryStore";
import { chainId } from "../config/config";
import axios from "axios";
import { toast } from "react-toastify";
import classNames from "classnames";
const Burn: FC = observer((props) => {
  const web3store = useInjection(Web3Store);
  const galleryStore = useInjection(GalleryStore);
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


  return (
    <>
      {!web3store.address ? (
        <div className={styles.containerConnect}>
          <ConnectButtonCustom />
        </div>
      ) : (
        <div className={styles.container}>
          <div className={styles.modal}>
            {galleryStore.characters.map((el, i) => {
              console.log(el);
              return (
                <div
                  key={i}
                  className={classNames(styles.modal__pill, blocked ==  styles.modal__blocked)}
                  onClick={() => startBurn(el.id)}
                >
                  <img src={"/api/image?cid=" + el?.image} />
                  <div className={styles.div}>
                    <div className={styles.div2}>{el?.name}</div>
                    <div className={styles.div3}>burn</div>
                  </div>
                </div>
              );
            })}
            {galleryStore.characters.length == 0 && (
              <div className={styles.modal__empty}>No pills to use</div>
            )}
          </div>
        </div>
      )}
    </>
  );
});
export default Burn;
