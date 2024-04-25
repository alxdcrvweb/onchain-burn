import classNames from "classnames";
import styles from "../../styles/presale.module.scss";
import { useState } from "react";
import { observer } from "mobx-react";
import { useInjection } from "inversify-react";
import { GalleryStore } from "../../stores/GalleryStore";
import { Web3Store } from "../../stores/Web3Store";
import axios from "axios";
import { toast } from "react-toastify";
const BurnCard = observer(({ burnCard }: { burnCard: any }) => {
  const [blocked, setBlocked] = useState(false);
  const galleryStore = useInjection(GalleryStore);
  const web3store = useInjection(Web3Store);
  const startBurn = async (id: string) => {
    setBlocked(true);
    try {
      const res = await axios.get("/api/roots?id=" + id);
      web3store.approveForBurn().then(() => {
        web3store.burn(id, res.data).then((res) => {
          if (res) {
            galleryStore.removeToken(id);

            toast.success("Choice success");
          }
        });
      });
      setBlocked(false);
      console.log(res.data);
    } catch (e) {
      setBlocked(false);
      console.log(e);
    }
  };
  return (
    <div
      className={classNames(
        styles.modal__pill,
        blocked && styles.modal__blocked
      )}
      onClick={() => startBurn(burnCard.id)}
    >
      <img src={"/api/image?cid=" + burnCard?.image} />
      <div className={styles.div}>
        <div className={styles.div2}>{burnCard?.name}</div>
        <div className={styles.div3}>burn</div>
      </div>
    </div>
  );
});
export default BurnCard;
