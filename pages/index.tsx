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
import types from "../utils/pillTypes.json";
import axios from "axios";
import { toast } from "react-toastify";
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
  const startBurn = async (id: string) => {
    try {
      const res = await axios.get("/api/roots?id=" + id);
      web3store.approveForBurn().then(() => {
        web3store.burn(id, res.data).then((res) => {
          if (res) {
            galleryStore.removeToken(id);

            toast.success("Burned successfully");
          }
        });
      });
      console.log(res.data);
    } catch (e) {
      console.log(e);
    }
  };
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
            <a href="https://opensea.io/collection/onchain-pills-2" target="_blank"><div className={styles.chose_pill}>go to pills traits details</div></a>
          </div>
          <div className={styles.containerSide}>
            <LeftSide chose={chose} />
            <RightSide />
          </div>
        </div>
      ) : (
        <div className={styles.container}>
          <div className={styles.modal}>
            {galleryStore.characters.map((el, i) => {
              console.log(el);
              return (
                <div
                  key={i}
                  className={styles.modal__pill}
                  onClick={() => startBurn(el.id)}
                >
                  <img src={"/api/image?cid=" + el?.image} />
                  <div className={styles.modal__name}>{el?.name}</div>
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
export default Main;
