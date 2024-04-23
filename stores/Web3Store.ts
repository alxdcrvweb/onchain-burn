import { action, makeObservable, observable } from "mobx";
import "reflect-metadata";
import Web3 from "web3";
import { RootStore } from "./RootStore";
import { presaleContract, presaleAbi } from "../utils/contracts/presale";
import { ModalsEnum } from "../modals";
import { injectable } from "inversify";
import BN from "bignumber.js";
import { toast } from "react-toastify";
import { toBNJS } from "../utils/utilities";
import { mintAbi, mintContract } from "../utils/contracts/mint";
interface User {
  login: string;
  email: string;
  address?: string;
  id?: string;
}

injectable();

export class Web3Store {
  @observable address: any = undefined;
  @observable isInitConnect: boolean = false;
  @observable provider: any = null;
  @observable web3: Web3 | null = null;
  @observable tokensList: any[] = [];
  @observable signer?: any | null = undefined;
  @observable contract?: any = undefined;
  @observable mint?: any = undefined;
  @observable correctChain: boolean = false;
  @observable connected: boolean = false;
  @observable unsupported?: boolean = false;
  @observable presaleStage: string = "";
  @observable myLimits: { pur: number; lim: number } = { pur: 0, lim: 0 };
  @observable wlLimit: string = "";
  @observable price: string = "";
  @observable fromWhitelisted: number = 0;
  @observable fromPills: number = 0;
  @observable fromPublic: number = 0;
  public constructor(private readonly rootStore: RootStore) {
    makeObservable(this);
  }
  setCorrectChain = (status: boolean) => {
    this.correctChain = status;
  };
  setInitConnect = (status: boolean) => {
    this.isInitConnect = status;
  };
  setProvider = (provider?: any, address?: string) => {
    if (address) {
      this.setInitConnect(true);
      this.address = address;
    }
    console.log("CONNECT", provider);
    if (provider) {
      // this.checked = true;
      // console.log("CONNECT");
      this.web3 = new Web3(provider);
      this.contract = new this.web3.eth.Contract(
        presaleAbi as any,
        presaleContract
      );
      this.mint = new this.web3.eth.Contract(mintAbi as any, mintContract);
      this.subscribeProvider();
    }
  };
  getPrice = async () => {
    try {
      const res = await this.contract.methods.price().call();
      this.price = res;
    } catch (e) {
      console.log(e);
    }
  };

  checkIsPaused = async () => {
    try {
      const pause = await this.contract.methods.paused().call();

      return pause;
    } catch (e) {
      console.log(e);
    }
  };
  
  whitelistBuy = async (amount: number) => {
    try {
      const buy = await this.contract?.methods.whitelistBuy(amount).send({
        from: this.address,
        value: toBNJS(this.price).multipliedBy(amount).toString(),
      });

      return buy;
    } catch (e) {
      console.log(e);
    }
  };
  publicBuy = async () => {
    try {
      const buy = await this.contract?.methods.publicBuy().send({
        from: this.address,
        value: toBNJS(this.price).toString(),
      });

      return buy;
    } catch (e) {
      console.log(e);
    }
  };
  pillBuy = async () => {
    try {
      const buy = await this.contract?.methods.pillBuy().send({
        from: this.address,
        value: toBNJS(this.price).toString(),
      });

      return buy;
    } catch (e) {
      console.log(e);
    }
  };
  setAmounts = async () => {
    try {
      const minted = await this.mint.methods.balanceOf(this.address).call();
      const res = await this.contract.methods
        .allowedToMintDuringWhitelistPhase(this.address)
        .call();
      const purPills = await this.contract.methods
        .purchasedDuringPillPhase(this.address)
        .call();
      const purPublic = await this.contract.methods
        .purchasedDuringPublicPhase(this.address)
        .call();
      const pur = await this.contract.methods
        .purchasedDuringWhitelistPhase(this.address)
        .call();
      console.log(minted);
      this.fromWhitelisted = Number(res) - Number(pur);
      this.fromPills = (Number(minted) > 0 ? 1 : 0) - Number(purPills);
      this.fromPublic = 1 - Number(purPublic);
    } catch (e) {
      console.log(e);
    }
  };
  setPills = async () => {
    try {
      const res = await this.contract.methods
        .allowedToMintDuringWhitelistPhase(this.address)
        .call();
      const res2 = await this.contract.methods
        .purchasedDuringWhitelistPhase(this.address)
        .call();
      this.fromWhitelisted = Number(res) - Number(res2);
    } catch (e) {
      console.log(e);
    }
  };
  getLimits = async () => {
    try {
      const lim = await this.contract.methods.totalLimit().call();
      const pur = await this.contract.methods.totalPurchased().call();
      this.myLimits = { pur: pur, lim: lim };
    } catch (e) {
      console.log(e);
    }
  };
  getWlLimits = async () => {
    try {
      const lim = await this.contract.methods.whitelistPhaseLimit().call();
      const pur = await this.contract.methods.totalPurchased().call();
      this.wlLimit = pur + " / " + lim;
    } catch (e) {
      console.log(e);
    }
  };
  getPresaleStage = async () => {
    try {
      const pill = await this.contract.methods.isPillPhase().call();
      const pub = await this.contract.methods.isPublicPhase().call();
      const wl = await this.contract.methods.isWhitelistPhase().call();
      console.log(pill, pub, wl);
      if (pill) this.presaleStage = "pill";
      if (pub) this.presaleStage = "public";
      if (wl) this.presaleStage = "whitelist";
    } catch (e) {
      console.log(e);
    }
  };

  setConnected = (connected: boolean) => {
    if (!this.contract) {
      this.connected = connected;
      this.web3 = new Web3(
        "https://endpoints.omniatech.io/v1/base/mainnet/public"
      );

      this.contract = new this.web3.eth.Contract(
        presaleAbi as any,
        presaleContract
      );
      this.mint = new this.web3.eth.Contract(mintAbi as any, mintContract);
    }
  };
  setAddress = (user: any) => {
    if (user?.address) {
      this.address = user.address;
    } else {
      console.log("hi disconnect 2");
      this.address = null;
    }
  };
  subscribeProvider = () => {
    console.log("subscribeProvider");
    this.web3?.currentProvider?.on("accountsChanged", (account) => {
      console.log("account", account);
      this.setAddress({ address: account[0] });
    });
  };

  disconnected = () => {
    this.address = null;
  };

  disconnectWallet = async () => {
    this.provider = null;
    this.address = null;
    this.web3 = null;
  };

  mintPrescription = async (id: string, amount: number, price: BN) => {
    console.log(price.toString());
    try {
      // this.rootStore.modalStore.hideModal(ModalsEnum.Mint);
      const res = await this.contract?.methods
        .presalePayedMint(id, amount)
        .send({
          from: this.address,
          value: price.toString(),
        });
      console.log(res);
      // this.disableMintModal = false;
      return true;
    } catch (error) {
      // this.disableMintModal = false;
      console.log(error);
      return false;
    }
  };
}
