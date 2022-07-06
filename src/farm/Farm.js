import React from "react";
import Navbar from "../components/Navbar";
import "../styles/App.css";
import { Button } from "react-bootstrap";

export default function Farm(props) {
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
                <Button className='me-3' style={{
                    backgroundColor: "#ffffff10",
                    boxShadow: "1px 1px 5px #000000",
                    marginBottom: "20px",
                  }}>Max</Button>
                  <input style={{ width: '70%', padding: '15px', borderRadius: '10px'}} placeholder="Input the amount"/>
              </div>

              <div className="stakebuttons" style={{  marginBottom: "20px", textAlign: 'left', position: 'relative' }} >
                  <Button className='ms-4' style={{ width: '35%', position: 'absolute', left: '0', bottom: '0', backgroundColor: "#ffffff10",boxShadow: "1px 1px 5px #000000" }}>Stake</Button>
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
                  <span style={{color: 'white'}}>13.33</span> LP
                </h5>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
