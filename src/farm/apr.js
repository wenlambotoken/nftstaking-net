import Web3 from 'web3';
import { account } from '../functions/ConnectButton';
import PAIRABI from '../blockchain/ABIs/PAIRABI.json';
import FARMABI from '../blockchain/ABIs/FARMABI.json';
import { Token, WBCH, ChainId } from '@mistswapdex/sdk';
import { MASTERCHEFCONTRACT, RLAMBOADDRESS, LAMBOADDRESS } from '../blockchain/config';
import axios from 'axios'

export var apr;
export var tvl; 

export default async function getRLamboPrice() {

  var web3 = new Web3(window.ethereum);
  const MasterchefContract = new web3.eth.Contract(FARMABI, MASTERCHEFCONTRACT)

  const FLEXUSD = new Token(ChainId.SMARTBCH, '0x7b2B3C5308ab5b2a1d9a94d20D35CCDf61e05b72', 18, 'flexUSD', 'flexUSD')
  const RLAM = new Token(ChainId.SMARTBCH, RLAMBOADDRESS, 18, 'RLAM', 'Reward Lambo');
  const LAMBO = new Token(ChainId.SMARTBCH, LAMBOADDRESS, 18, 'LAMBO', 'Lambo Token');

  const hardcodedPairs = {
    "0xC6c4d0531313d5B95169F15F0441F96784835054": {
      farmId: 0,
      allocPoint: 10000,
      token0: RLAM,
      token1: LAMBO,
    },
    "0x27580618797a2CE02FDFBbee948388a50a823611": {
      farmId: 888,
      allocPoint: 0,
      token0: WBCH[ChainId.SMARTBCH],
      token1: new Token(ChainId.SMARTBCH, '0xBc2F884680c95A02cea099dA2F524b366d9028Ba', 18, 'bcUSDT', 'BlockNG-Peg USDT Token'),
    },
    "0xE1B5bC09427710BC4d886eC49654944110B58134": {
      farmId: 48,
      allocPoint: 9069975,
      token0: WBCH[ChainId.SMARTBCH],
      token1: new Token(ChainId.SMARTBCH, '0x0E36C351ff40183435C9Bd1D17bfb1F3548f1963', 18, 'LAMBO', 'wenlambo'),
    },
  }
  var farms = []

  for (const [pairAddress, pair] of Object.entries(hardcodedPairs)) {
    const V2PairContract = new web3.eth.Contract(PAIRABI, pairAddress);

    const f = {
      pair: pairAddress,
      symbol: `${hardcodedPairs[pairAddress].token0.symbol}-${hardcodedPairs[pairAddress].token1.symbol}`,
      pool: {
        reserves: 0,
        totalSupply: 0,
        token0: undefined,
        token1: undefined,
      },
      allocPoint: pair.allocPoint,
      balance: "1000000000000000000",
      chef: 0,
      id: pair.farmId,
      pendingSushi: undefined,
      pending: 0,
      owner: {
        id: MASTERCHEFCONTRACT,
        sushiPerBlock: "10000000000000000000",
        totalAllocPoint: "10000"
      },
      userCount: 1,
    }

    f.pool.totalSupply = await V2PairContract.methods.totalSupply().call();
    f.pool.reserves = await V2PairContract.methods.getReserves().call();
    f.pendingSushi = await MasterchefContract.methods.pendingSushi(pair.farmId, account);
    f.pool.token0 = await V2PairContract.methods.token0().call();
    f.pool.token1 = await V2PairContract.methods.token1().call();
    f.pending = Number.parseFloat(f.pendingSushi).toFixed();

    farms.push(f);
  }

  let bchPriceUSD = 100;
  let lamboPriceBch = 0.0008;
  let rLamPriceUSD = 0.001; // precio en lambos
  let rLamPriceLambo = 0.001;
  const lamborlamPool = farms.find((v) => v.pair === '0xC6c4d0531313d5B95169F15F0441F96784835054').pool;
  const bchusdtPool = farms.find((v) => v.pair === '0x27580618797a2CE02FDFBbee948388a50a823611').pool;
  const lambobchPool = farms.find((v) => v.pair === '0xE1B5bC09427710BC4d886eC49654944110B58134').pool;

  if (bchusdtPool.reserves) {
    bchPriceUSD = Number.parseFloat(Number(bchusdtPool.reserves[1]).toFixed()) / Number.parseFloat(Number(bchusdtPool.reserves[0]).toFixed());
  }
  if (lambobchPool.reserves) {
    lamboPriceBch = Number.parseFloat(Number(lambobchPool.reserves[1]).toFixed()) / Number.parseFloat(Number(lambobchPool.reserves[0]).toFixed());
  }
  if (lamborlamPool.reserves && bchusdtPool.reserves && lambobchPool.reserves) {
    rLamPriceLambo = 1. / ( Number.parseFloat(Number(lamborlamPool.reserves[1]).toFixed()) / Number.parseFloat(Number(lamborlamPool.reserves[0]).toFixed()))
    rLamPriceLambo = rLamPriceLambo * lamboPriceBch; //precio en bch
    rLamPriceUSD = rLamPriceLambo * bchPriceUSD
    console.log(rLamPriceUSD);
  } 

  const v2PairsBalances = await Promise.all(farms.map(async (farm) => {
    const lpToken = new Token(ChainId.SMARTBCH, farm.pair, 18, 'LP', 'LP Token');
    const apicall = await axios.get(`https://sonar.cash/api?module=account&action=tokenbalance&contractaddress=${lpToken.address}&address=${MASTERCHEFCONTRACT}`)
    .then(output => {
      const { result } = output.data;
      const address  = lpToken.address;
      return [Web3.utils.fromWei(result, 'ether'), address]
    })
    return apicall;
  }))

  for (let i=0; i<farms.length; ++i) {
    if (v2PairsBalances[i][1] && farms[i].pool.totalSupply) {
      const totalSupply = farms[i].pool.totalSupply;
      const chefBalance = v2PairsBalances[i][0];

      if (farms[i].pool.token1 === RLAM.address) {
        const reserve = Number.parseFloat(farms[i].pool.reserves[1]).toFixed();
        tvl = reserve / totalSupply * chefBalance * rLamPriceUSD * 2;
      } 
      else if (farms[i].pool.token1 === RLAM.address) {
        const reserve = Number.parseFloat(farms[i].pool.reserves[1]).toFixed();
        tvl = reserve / totalSupply * chefBalance * rLamPriceUSD * 2;
      }
      else if (farms[i].pool.token0 === WBCH[ChainId.SMARTBCH].address) {
        const reserve = Number.parseFloat(farms[i].pool.reserves[0]).toFixed();
        tvl = reserve / totalSupply * chefBalance * bchPriceUSD * 2;
      }
      else if (farms[i].pool.token1 === WBCH[ChainId.SMARTBCH].address) {
        const reserve = Number.parseFloat(farms[i].pool.reserves[1]).toFixed();
        tvl = reserve / totalSupply * chefBalance * bchPriceUSD * 2;
      }
      farms[i].tvl = tvl;
      farms[i].totalSupply = totalSupply;
      farms[i].chefBalance = chefBalance;
    } else {
      farms[i].tvl = "0";
      farms[i].totalSupply = 0;
      farms[i].chefBalance = 0;
    }
  }
  tvl = Number(farms[0].tvl).toFixed(2);

  const totalAllocPoint = await MasterchefContract.methods.totalAllocPoint().call();
  const sushiPerBlock = await MasterchefContract.methods.sushiPerBlock().call();

  for(let i = 0; i < farms.length; i++) {
    const poolAllocPoint = farms[i].allocPoint
    const blocksPerDay = 15684; // calculated empirically

    const rewardPerBlock = (poolAllocPoint / totalAllocPoint) * Web3.utils.fromWei(sushiPerBlock) * 20;

    const defaultReward = {
      rewardPerBlock,
      rewardPerDay: rewardPerBlock * blocksPerDay,
      rewardPrice: +rLamPriceUSD,
    }

    const defaultRewards = [defaultReward]

    const roiPerBlock = defaultRewards.reduce((previousValue, currentValue) => {
      return previousValue + currentValue.rewardPerBlock * currentValue.rewardPrice
    }, 0) / farms[i].tvl;

    const roiPerDay = roiPerBlock * blocksPerDay;

    const roiPerYear = roiPerDay * 365;

    farms[i].apr = roiPerYear;
  }
  apr = farms[0].apr;
}
