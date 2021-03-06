import { Contract } from '@ethersproject/contracts'
import { abi as AIRDROP_ABI } from '@pangolindex/governance/artifacts/contracts/Airdrop.sol/Airdrop.json'
import { abi as GOVERNANCE_ABI } from '@pangolindex/governance/artifacts/contracts/GovernorAlpha.sol/GovernorAlpha.json'
import { abi as LIQUIDITY_POOL_MANAGER_ABI } from '@partyswap-libs/party-governance/build/contracts/LiquidityPoolManager.json'
import { abi as STAKING_REWARDS_ABI } from '@partyswap-libs/party-governance/build/contracts/StakingRewards.json'
import { abi as JACCUZZI_ABI } from '@partyswap-libs/party-jacuzzi/build/contracts/PartyJacuzzi.json'
import { abi as IPartyPairABI } from '@partyswap-libs/party-swap-core/build/IPartyPair.json'
import { ChainId, WAVAX } from '@partyswap-libs/sdk'
import { useMemo } from 'react'
import { abi as PARTY_ABI } from 'yay-token/build/contracts/PartyToken.json'
import {
  AIRDROP_ADDRESS,
  BOOSTED_LIQUIDITY_POOL_MANAGER_ADDRESS,
  GOVERNANCE_ADDRESS,
  JACUZZI_ADDRESS,
  LIQUIDITY_POOL_MANAGER_ADDRESS,
  PARTY
} from '../constants'
import { abi as BOOSTED_LIQUIDITY_POOL_MANAGER_ABI } from '../constants/abis/boosted-lpm.json'
import ENS_PUBLIC_RESOLVER_ABI from '../constants/abis/ens-public-resolver.json'
import { ERC20_BYTES32_ABI } from '../constants/abis/erc20'
import ERC20_ABI from '../constants/abis/erc20.json'
import { MIGRATOR_ABI, MIGRATOR_ADDRESS } from '../constants/abis/migrator'
import WETH_ABI from '../constants/abis/weth.json'
import { MULTICALL_ABI, MULTICALL_NETWORKS } from '../constants/multicall'
import { V1_EXCHANGE_ABI, V1_FACTORY_ABI, V1_FACTORY_ADDRESSES } from '../constants/v1'
import { getContract } from '../utils'
import { useActiveWeb3React } from './index'
import AGGREGATOR_ROUTER_ABI from '../constants/abis/aggregator-router.json'
import OFF_CHAIN_ORACLE_ABI from '../constants/abis/oracle.json'

// returns null on errors
function useContract(address: string | undefined, ABI: any, withSignerIfPossible = true): Contract | null {
  const { library, account } = useActiveWeb3React()

  return useMemo(() => {
    if (!address || !ABI || !library) return null
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
}

export function useV1FactoryContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && V1_FACTORY_ADDRESSES[chainId], V1_FACTORY_ABI, false)
}

export function useAggregatorRouter(routerAddres: string): Contract | null {
  return useContract(routerAddres, AGGREGATOR_ROUTER_ABI, false)
}

export function useOracleContract(): Contract | null {
  return useContract('0xBd0c7AaF0bF082712EbE919a9dD94b2d978f79A9', OFF_CHAIN_ORACLE_ABI, false)
}

export function useV2MigratorContract(): Contract | null {
  return useContract(MIGRATOR_ADDRESS, MIGRATOR_ABI, true)
}

export function useV1ExchangeContract(address?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, V1_EXCHANGE_ABI, withSignerIfPossible)
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useWETHContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? WAVAX[chainId].address : undefined, WETH_ABI, withSignerIfPossible)
}

export function useENSResolverContract(address: string | undefined, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(pairAddress, IPartyPairABI, withSignerIfPossible)
}

export function useMulticallContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && MULTICALL_NETWORKS[chainId], MULTICALL_ABI, false)
}

export function useGovernanceContract(): Contract | null {
  return useContract(GOVERNANCE_ADDRESS, GOVERNANCE_ABI, true)
}

export function usePartyContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? PARTY[chainId].address : undefined, PARTY_ABI, true)
}

export function useStakingContract(stakingAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(stakingAddress, STAKING_REWARDS_ABI, withSignerIfPossible)
}

export function useAirdropContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? AIRDROP_ADDRESS[chainId] : undefined, AIRDROP_ABI, true)
}

export function useJacuzziContract() {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? JACUZZI_ADDRESS[chainId] : undefined, JACCUZZI_ABI)
}

function useLiquidityPoolManagerAddress(version: 'v2' | 'boosted', chainId: ChainId | undefined) {
  if (!chainId) return undefined
  switch (version) {
    case 'v2':
      return LIQUIDITY_POOL_MANAGER_ADDRESS[chainId]
    case 'boosted':
      return BOOSTED_LIQUIDITY_POOL_MANAGER_ADDRESS[chainId]
  }
}

export function useLiquidityPoolManagerContract(boosted: boolean = false) {
  const { chainId } = useActiveWeb3React()
  const abi = boosted ? BOOSTED_LIQUIDITY_POOL_MANAGER_ABI : LIQUIDITY_POOL_MANAGER_ABI
  const address = useLiquidityPoolManagerAddress(boosted ? 'boosted' : 'v2', chainId)
  return useContract(address, abi, false)
}
