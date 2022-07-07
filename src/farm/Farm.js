import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/App.css";
import { Button } from "react-bootstrap";
import { farmcontract } from "../functions/ConnectButton";
import { MASTERCHEFCONTRACT } from "../blockchain/config";
import { lpcontract } from "../functions/ConnectButton";
import { infinite } from "../blockchain/config";
import { account } from "../functions/ConnectButton";
import Web3 from "web3";

/* Encontrar una manera de hacer que 'stakedBalance' se actualice cuando hay un deposit o un withdraw, o en render */

export default function Farm() {
  const [balance, setBalance] = useState(0);

  window.onload = function () {
    totalDeposit()
  }

  async function enable() {
    await lpcontract.methods.approve(MASTERCHEFCONTRACT, infinite).send({ from: account });
  }

  async function balanceOf() {
    var balanceCall = await lpcontract.methods.balanceOf(account).call();
    var result = Web3.utils.fromWei(balanceCall);
    var balance = Number(result);
    document.querySelector('#amount').value = balance;
  }

  async function deposit() {
    const amount = document.querySelector('#amount').value;
    await farmcontract.methods.deposit(0, Web3.utils.toWei(amount, 'ether')).send({ from: account });
  }

  async function withdraw() {

  }

  async function totalDeposit() {
    var totalStaked = await farmcontract.methods.userInfo(0, account).call();
    var deposit = Web3.utils.fromWei(totalStaked.amount);
    var totalBalance = Number(deposit);
    console.log(totalStaked)
    setBalance(totalBalance);
  }
  

  return (
    <div>
      <div className="nftapp" style={{ height: "100%", textAlign: "center"}}>
        <Navbar />
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
              <div className="lp_input pb-5">
                <Button 
                className='me-3' 
                onClick={balanceOf}
                style={{
                    backgroundColor: "#ffffff10",
                    boxShadow: "1px 1px 5px #000000",
                    marginBottom: "20px",
                  }}>
                    Max
                    </Button>
                  <input id='amount' 
                  style={{ 
                    width: '70%', 
                    padding: '15px', 
                    borderRadius: '10px',
                    borderColor: "black",
                    color: "white",
                    backgroundColor: "#ffffff10",
                    boxShadow: "1px 1px 5px #00000",
                  }}
                  placeholder="Input the amount"
                  />
              </div>

              <div className="stakebuttons" style={{  marginBottom: "20px", textAlign: 'left', position: 'relative' }} >
                  <Button 
                  className='ms-4' 
                  style={{ width: '35%', position: 'absolute', left: '0', bottom: '0', backgroundColor: "#ffffff10",boxShadow: "1px 1px 5px #000000" }}
                  onClick={deposit}
                  >
                  Stake
                  </Button>
                  <Button className='me-4' style={{ width: '35%', position: 'absolute', right: '0', bottom: '0', backgroundColor: "#ffffff10",boxShadow: "1px 1px 5px #000000" }}>Unstake</Button>
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
                  <span style={{color: 'white'}}>13.33</span> RLAM
                </h5>
                <Button style={{
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
