import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";
// import { cont } from "./constants.js";
const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const balanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton");
connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;

console.log(ethers);

async function connect() {
  console.log("hii");
  if (typeof window.ethereum != undefined) {
    window.ethereum.request({ method: "eth_requestAccounts" });
    connectButton.innerHTML = "connected";
  } else connectButton.innerHTML = "Please install MetaMask";
}
async function getBalance() {
  if (typeof window.ethereum != undefined) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    console.log(ethers.utils.formatEther(balance));
    // alert(balance);
  }
}
async function withdraw() {
  if (typeof window.ethereum != undefined) {
    console.log("withdrawing...");

    // const withdrawAmount = document.getElementById("withdrawAmount").value;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.withdraw();
      await listenForTranscationMine(transactionResponse, provider);
    } catch (error) {
      console.log(error);
    }
  }
}

async function fund() {
  const ethAmount = document.getElementById("ethAmount").value;

  console.log(`Funding with ${ethAmount}...`);
  if (typeof window.ethereum != undefined) {
    //provider/connection
    //wallet/gas
    //contract
    //ABI &address
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });
      await listenForTranscationMine(transactionResponse, provider);
      console.log("done");
    } catch (error) {
      console.log(error);
    }
  }
}
function listenForTranscationMine(transactionResponse, provider) {
  console.log(`mining ${transactionResponse.hash}...`);
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations}confirmations`
      );
      resolve();
    });
  });
}
