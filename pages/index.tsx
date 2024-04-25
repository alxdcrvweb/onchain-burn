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
import { useRouter } from "next/router";
import { toast } from "react-toastify";
const Main: FC = observer((props) => {
  const web3store = useInjection(Web3Store);
  const galleryStore = useInjection(GalleryStore);
  const [isWhitelist, setWhitelist] = useState(true);
  const router = useRouter();
  useEffect(() => {
    if (web3store.address) {
      web3store?.checkWl().then((res) => {
        console.log(res, "whitelist");
        setWhitelist(res);
      });
      galleryStore.getCharacters(web3store.address, chainId).then((res) => {
        galleryStore.setCharacters(res ? res : []);
      });
      galleryStore.getRecepts(web3store.address, chainId).then((res) => {
        galleryStore.setRecepts(res ? res : []);
      });
    }
  }, [web3store.address]);
  useEffect(() => {
    if (web3store.address) {
      web3store?.checkWl().then((res) => {
        console.log(res, "whitelist");
        setWhitelist(res);
      });
      galleryStore.getCharacters(web3store.address, chainId).then((res) => {
        galleryStore.setCharacters(res ? res : []);
      });
      galleryStore.getRecepts(web3store.address, chainId).then((res) => {
        galleryStore.setRecepts(res ? res : []);
      });
    }
  }, []);
  useEffect(() => {
    if (web3store.address) {
      // web3store.setAmounts();
    }
  }, [web3store.address]);

  const chose = () => {
    if (galleryStore.characters.length == 0)
      return toast.error("You don't have any pills");
    if (isWhitelist && galleryStore.recepts.length == 0)
      return toast.error("You don't have any recepts");
    router.push("/burn");
  };
  return (
    <>
      {!web3store.address ? (
        <div className={styles.containerConnect}>
          <ConnectButtonCustom />
        </div>
      ) : (
        <div className={styles.container}>
          <div className={styles.chose}>
            <div className={styles.chose_w}>Choose wisely</div>
            <a
              href="https://opensea.io/collection/onchain-pills-2"
              target="_blank"
            >
              <div className={styles.chose_pill}>
                go to pills traits details
              </div>
            </a>
          </div>
          <div className={styles.containerSide}>
            <LeftSide chose={chose} />
            <RightSide />
          </div>
        </div>
      )}
    </>
  );
});
export default Main;
