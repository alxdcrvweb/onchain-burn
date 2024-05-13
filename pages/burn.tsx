import { FC, useEffect } from "react";
import { observer } from "mobx-react";
import styles from "../styles/presale.module.scss";
import { useInjection } from "inversify-react";
import { Web3Store } from "../stores/Web3Store";
import ConnectButtonCustom from "../components/Header/connectButtonCustom";
import { GalleryStore } from "../stores/GalleryStore";
import { chainId, timeToMint } from "../config/config";
import axios from "axios";
import { toast } from "react-toastify";
import classNames from "classnames";
import BurnCard from "../components/burn/burnCard";
import { useRouter } from "next/router";
const Burn: FC = observer((props) => {
  const web3store = useInjection(Web3Store);
  const galleryStore = useInjection(GalleryStore);
  const router = useRouter();
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
      if (Date.now() < timeToMint) {
        router.push("/");
      }
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
          <div className={styles.upper} onClick={() => router.push("/")}>
            {"< back"}
          </div>
          <div className={styles.chose_burn}>
            <div className={styles.chose_w}>Choose wisely</div>
            <a href="https://paragraph.xyz/@lama/onchain-pills" target="_blank">
              <div className={styles.chose_pill}>
                go to pills traits details
              </div>
            </a>
          </div>

          <div className={styles.modal}>
            {galleryStore.characters.map((el, i) => {
              // console.log(el);
              return <BurnCard key={i} el={el} />;
            })}
            {/* <BurnCard key={1} el={{}} />; */}
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
