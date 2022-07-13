import Web3 from 'web3';
import { MASTERCHEFCONTRACT } from '../blockchain/config';
import { bchpaircontract, chefBalanceContract } from '../functions/ConnectButton';
import { paircontract } from '../functions/ConnectButton';

// Crear un contrato con la interfaz de IUniswapV2PairABI y el contract address del par a usar.
// Callear getReserves del contrato y almacenar el resultado en una constante que sea 'reserves'

export default async function getRLamboPrice() {
  const reserves = await paircontract.methods.getReserves().call()
  const totalSupply = await paircontract.methods.totalSupply().call()
  const bchReserves = await bchpaircontract.methods.getReserves().call()
  const chefBalance = await chefBalanceContract.methods.balanceOf(MASTERCHEFCONTRACT).call()


  let rLamPriceUSD = 0;
  let BCHPriceUSD = 0;
  if(bchReserves) {
    BCHPriceUSD = (Number.parseFloat(Number(bchReserves[0]).toFixed()) / Number.parseFloat(Number(bchReserves[1]).toFixed()));
  }
  if (reserves) {
    rLamPriceUSD = BCHPriceUSD * (Number.parseFloat(Number(reserves[1]).toFixed()) / Number.parseFloat(Number(reserves[0]).toFixed()));
  }

  console.log(rLamPriceUSD);
  console.log(BCHPriceUSD);

  let tvl = 0;
  if (reserves) {
    const reserve0 = (Number.parseFloat(Number(reserves[1]).toFixed()));
    tvl = reserve0 / totalSupply * Web3.utils.fromWei(chefBalance) * rLamPriceUSD * 1000;
  }
  console.log(tvl);
}
