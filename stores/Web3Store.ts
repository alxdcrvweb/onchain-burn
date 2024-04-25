import { action, makeObservable, observable } from "mobx";
import "reflect-metadata";
import Web3 from "web3";
import { RootStore } from "./RootStore";
import { burnContract, burnAbi } from "../utils/contracts/burn";
import { ModalsEnum } from "../modals";
import { injectable } from "inversify";
import BN from "bignumber.js";
import types from "../utils/pillTypes.json";
import { mintAbi, mintContract } from "../utils/contracts/mint";
import { toast } from "react-toastify";
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
  checkPause = async () => {
    try {
      const res = await this.contract.methods
        .paused()
        .call();
      return res;
    } catch (e) {
      console.log(e);
      // return false;
    }
  };
  checkWl = async () => {
    try {
      const res = await this.contract.methods
        .isWhitelistPhase()
        .call();
      return res;
    } catch (e) {
      console.log(e);
      // return false;
    }
  };
  approveForBurn = async () => {
    const isApproved = await this.mint?.methods
      .isApprovedForAll(this.address, burnContract)
      .call();
    try {
      if (!isApproved) {
        const res = await this.mint.methods
          .setApprovalForAll(burnContract, true)
          .send({ from: this.address });
        return res;
      } else return true;
    } catch (e: any) {
      console.log(e);
      if (e?.message?.includes("Cannot set properties")) {
        toast.error("Please confirm transaction", { theme: "dark" });
      } else {
        toast.error(e?.message, { theme: "dark" });
      }
    }
  };
  burn = async (id: string, data: any) => {
    try {
      const type = types[Number(id) - 1].type;
      console.log(id, data, type);
      await this.contract.methods.burnToMint(id, type, data).send({
        from: this.address,
      });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
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
      this.contract = new this.web3.eth.Contract(burnAbi as any, burnContract);
      this.mint = new this.web3.eth.Contract(mintAbi as any, mintContract);
      this.subscribeProvider();
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

  setConnected = (connected: boolean) => {
    if (!this.contract) {
      this.connected = connected;
      this.web3 = new Web3(
        "https://endpoints.omniatech.io/v1/base/mainnet/public"
      );

      this.contract = new this.web3.eth.Contract(burnAbi as any, burnContract);
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
