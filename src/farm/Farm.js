import Navbar from "../components/Navbar.js";
import "../styles/App.css";
import { Button } from "react-bootstrap";
import { farmcontract } from "../functions/ConnectButton";
import { MASTERCHEFCONTRACT } from "../blockchain/config";
import { lpcontract } from "../functions/ConnectButton";
import { infinite } from "../blockchain/config";
import { account } from "../functions/ConnectButton";
import Web3 from "web3";
import React, { useState } from "react";
import { FarmConnectWallet } from "../functions/ConnectButton";
import getRLamboPrice  from './apr';

export default function Farm() {

  if(window.location.pathname === '/farm') {
    window.onload = async () => {
      await FarmConnectWallet()
      // totalDeposit()
      // pendingRewards()
      getRLamboPrice()
      // window.setInterval(() => {
      //   pendingRewards()
      //   totalDeposit()
      // }, 1000);    
    } 
  }

  const [balance, setBalance] = useState(0);
  const [rewards, setRewards] = useState(0);

  /*
  Para obtener el apr se necesita:
  3- Precio del LP
  5- Bloques por dia y por anio
  6- Cuantas tokens se emiten por bloque al dia/anio
  */

  async function enable() {
    await lpcontract.methods.approve(MASTERCHEFCONTRACT, infinite).send({ from: account });
  }

  async function balanceOf() {
    var balanceCall = await lpcontract.methods.balanceOf(account).call();
    var result = Web3.utils.fromWei(balanceCall, 'ether');
    document.querySelector('#amount').value = result;
  }

  async function deposit() {
    const value = document.querySelector('#amount').value;
    const amount = Web3.utils.toWei(value, 'ether'); 
    await farmcontract.methods.deposit(0, amount).send({ from: account });

    const totalStaked = await farmcontract.methods.userInfo(0, account).call();
    var deposit = Web3.utils.fromWei(totalStaked.amount);
    var totalBalance = Number(deposit);
    setBalance(totalBalance);
  }

  async function withdraw() {
    const value = document.querySelector('#unstk-amount').value;
    const amount = Web3.utils.toWei(value, 'ether'); 
    await farmcontract.methods.withdraw(0, amount).send({ from: account });

    const totalStaked = await farmcontract.methods.userInfo(0, account).call();
    var deposit = Web3.utils.fromWei(totalStaked.amount);
    var totalBalance = Number(deposit).toFixed(4);
    setBalance(totalBalance);
  }

  async function totalDeposit() {
    const totalStaked = await farmcontract.methods.userInfo(0, account).call();
    var deposit = Web3.utils.fromWei(totalStaked.amount);
    var totalBalance = Number(deposit);
    setBalance(totalBalance);
  }

  async function totalStaked() {
    const totalStaked = await farmcontract.methods.userInfo(0, account).call();
    var deposit = Web3.utils.fromWei(totalStaked.amount);
    document.querySelector('#unstk-amount').value = deposit;
  }

  async function pendingRewards() {
    const pendingRewards = await farmcontract.methods.pendingSushi(0, account).call();
    const rawRewards = Web3.utils.fromWei(pendingRewards)
    const rewards = Number(rawRewards).toFixed(4)
    setRewards(rewards)
  }

  async function harvest() {
    await farmcontract.methods.withdraw(0, 0).send({ from: account })
    setRewards(0)
  }

  return (
    <div>
      <div className="nftapp" style={{ height: "100%", textAlign: "center"}}>
        {/* Crear un prop que sirva para *connectwallet* */}
        <Navbar 
        connectwallet={FarmConnectWallet}
        />
        <div className="container" id="farm-container">
          <div className="col">
            <form style={{ margin: "auto", paddingBottom: '5px' }} className="nftminter">
              <div className="row pt-3">
                <div>
                  <h1 className="pt-2" style={{ fontWeight: "30" }}>
                    RLAM-LAMBO LP
                  </h1>
                  <h5 className="mb-4" style={{ fontWeight: "300" }}>
                    (Mistswap)
                  </h5>
                </div>
              </div>
              <div className="approvezone">
                <h6 style={{ fontWeight: "40" }}>AUTHORIZE YOUR WALLET</h6>
                <Button
                  className="btn authorize"
                  onClick={enable}
                  style={{
                    backgroundColor: "#ffffff10",
                    boxShadow: "1px 1px 5px #000000",
                    marginBottom: "20px",
                  }}
                  >
                  Approve
                </Button>
              </div>
              <div className="lp_input pb-2 pt-4">
                  <Button 
                  style={{ marginRight: '10px', marginBottom: '30px', width: '20%', height: '40px', backgroundColor: "#ffffff10",boxShadow: "1px 1px 5px #000000" }}
                  onClick={deposit}
                  >
                  Stake
                  </Button>
                  <input id='amount' 
                  style={{ 
                    width: '50%',
                    height: '40px',
                    padding: '15px', 
                    borderRadius: '10px',
                    borderColor: "black",
                    color: "white",
                    backgroundColor: "#ffffff10",
                    boxShadow: "1px 1px 5px #00000",
                  }}
                  placeholder="Input the amount"
                  />
                <Button 
                className='btn-sm'
                onClick={balanceOf}
                style={{
                    marginBottom: '35px',
                    marginLeft: '10px',
                    backgroundColor: "#ffffff10",
                    boxShadow: "1px 1px 5px #000000",
                  }}>
                    Max
                    </Button>
              </div>
              <div className="lp_input pb-5">
                  <Button 
                  onClick={withdraw}
                  style={{ marginRight: '10px', marginBottom: '30px', width: '20%', height: '40px', backgroundColor: "#ffffff10",boxShadow: "1px 1px 5px #000000" }}>
                    Unstake
                    </Button>
                  <input id='unstk-amount' 
                  style={{ 
                    width: '50%', 
                    padding: '15px',
                    height: '40px', 
                    borderRadius: '10px',
                    borderColor: "black",
                    color: "white",
                    backgroundColor: "#ffffff10",
                    boxShadow: "1px 1px 5px #00000",
                  }}
                  placeholder="Input the amount"
                  />
                   <Button className='btn-sm' onClick={totalStaked}
                    style={{
                    marginBottom: '35px',
                    marginLeft: '10px',
                    backgroundColor: "#ffffff10",
                    boxShadow: "1px 1px 5px #000000",
                   }}>
                    Max
                    </Button>
              </div>
            <div className="rewards farmgoldeffect" style={{borderStyle: 'solid', borderColor: 'darkblue', width: '90%', margin: 'auto', borderRadius: '20px', marginBottom: '50px', borderWidth: '1px'}}>
                <h4 className="pt-3" style={{ fontWeight: "300" }}>
                  APR
                </h4>
                <h5>142.3%</h5>
                <h4 className="pt-3" style={{ fontWeight: "300" }}>
                  Your Rewards
                </h4>
                <h5
                  style={{
                    marginTop: '20px',
                    marginBottom: '20px',
                    fontWeight: "400",
                    color: 'yellow'
                  }}
                >
                  <span id='rewards' style={{color: 'white'}}>{rewards}</span> RLAM
                </h5>
                <Button 
                onClick={harvest}
                style={{
                  backgroundColor: "#ffffff10",
                  boxShadow: "1px 1px 5px #000000",
                  marginBottom: "20px",
                  width: '60%',
                }}>Harvest</Button>
                <h4 className="pt-3" style={{ fontWeight: "300" }}>
                  Your Staked Balance
                </h4>
                <h5
                  style={{
                    marginTop: '20px',
                    marginBottom: '20px',
                    fontWeight: "400",
                    color: 'yellow'
                  }}
                >
                  <span id="stakedBalance" style={{color: 'white'}}>{balance}</span> LP
                </h5>
                <Button 
                onClick={totalDeposit}
                style={{
                  backgroundColor: "#ffffff10",
                  boxShadow: "1px 1px 5px #000000",
                  marginBottom: "20px",
                  width: '60%',
                }}>Update</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
