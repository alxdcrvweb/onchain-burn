import { FC, useEffect, useState } from "react";
import { observer } from "mobx-react";
import styles from "../styles/presale.module.scss";
import { useInjection } from "inversify-react";
import { Web3Store } from "../stores/Web3Store";
import ConnectButtonCustom from "../components/Header/connectButtonCustom";
import LeftSide from "../components/LeftSide/leftSide";
import RightSide from "../components/RightSide/rightSide";
const Main: FC = observer((props) => {
  const web3store = useInjection(Web3Store);
  const [modal, setModal] = useState(false);
  useEffect(() => {
    if (web3store.address) {
      web3store.getPrice();
      web3store.getPresaleStage();
      web3store.getLimits();
    }
  }, [web3store.address]);
  useEffect(() => {
    if (web3store.address) {
      web3store.setAmounts();
    }
  }, [web3store.address]);
  console.log(
    web3store.presaleStage,
    web3store.fromWhitelisted,
    web3store.fromPills
  );
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

        </div>
      )}
    </>
  );
});
export default Main;
