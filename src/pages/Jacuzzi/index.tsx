import { ChainId, JSBI, TokenAmount } from '@partyswap-libs/sdk'
import { ethers } from 'ethers'
import React, { useEffect, useMemo, useState, useCallback } from 'react'
import styled from 'styled-components'
import { JACUZZI_ADDRESS, toFixedTwo, YAY, YAY_DECIMALS_DIVISOR } from '../../constants'
import { useActiveWeb3React } from '../../hooks'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { useJacuzziContract, useYayContract } from '../../hooks/useContract'
import { ButtonPrimary } from '../../components/Button'
import JacuzziStakingModal from '../../components/jacuzzi/JacuzziStakingModal'
import JacuzziLeaveModal from '../../components/jacuzzi/JacuzziLeaveModal'
import { isTransactionRecent, useAllTransactions } from '../../state/transactions/hooks'
import { newTransactionsFirst } from '../../components/Web3Status'

import { ReactComponent as JacuzziImg } from '../../assets/svg/jacuzzi-hero.svg'
import { ReactComponent as PoolIcon } from '../../assets/svg/AVAX-YAY.svg'
import { ReactComponent as ArrowDown } from '../../assets/svg/arrow-down.svg'
import { ReactComponent as BadgeSVG } from '../../assets/svg/badge.svg'
import { ReactComponent as ExternalLinkSVG } from '../../assets/svg/external-link.svg'

const Wrapper = styled.div`
  width: 100vw;
  margin-top: -2rem;
  @media (min-width: 720px) {
    margin-top: -100px;
  }
`

const JacuzziImage = styled(JacuzziImg)`
  /* display: none; */
`

const JacuzziCard = styled.div`
  display: flex;
  padding: 1rem;
  flex-direction: column;
  border-radius: 1rem;
  border: 1px solid gray;

  div {
    margin: 0.5rem 0;
  }
`
const ExtLink = styled(ExternalLinkSVG)`
  margin-left: 0.125em;
`

const BadgeIcon = styled(BadgeSVG)`
  margin-right: 0.125em;
`

export default function Jacuzzi() {
  const { chainId, account } = useActiveWeb3React()
  const [approvalSubmitted, setApprovalSubmitted] = useState(false)
  const [ratio, setRatio] = useState(0)
  const [earlyLeavePenalty, setEarlyLeavePenalty] = useState(0)
  const [earlyLeavePenaltyAfterUnlockDate, setEarlyLeavePenaltyAfterUnlockDate] = useState(0)
  const [unlockDate, setUnlockDate] = useState(new Date().toLocaleString())
  const [userxYAYStake, setUserXYAYStake] = useState(0)
  const [userYAYStake, setUserYAYStake] = useState(0)
  const [userYAYBalance, setUserYAYBalance] = useState(0)
  const [jacuzziXYAYStake, setJacuzziXYAYStake] = useState(0)
  const [jacuzziYAYStake, setJacuzziYAYStake] = useState(0)
  const [stakeModalOpen, setStakeModalOpen] = useState(false)
  const [unstakeModalOpen, setUnstakeModalOpen] = useState(false)

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const confirmed = useMemo(() => sortedRecentTransactions.filter((tx: any) => tx.receipt).map((tx: any) => tx.hash), [
    sortedRecentTransactions
  ])

  const parsedMaxAmount = new TokenAmount(
    YAY[chainId ? chainId : ChainId.FUJI],
    JSBI.BigInt(ethers.constants.MaxUint256)
  )
  const parsedCurrentBalance = new TokenAmount(
    YAY[chainId ? chainId : ChainId.FUJI],
    JSBI.BigInt(userYAYBalance * YAY_DECIMALS_DIVISOR)
  )

  const [, handleAprove] = useApproveCallback(parsedMaxAmount, JACUZZI_ADDRESS[chainId ? chainId : ChainId.FUJI])
  const [approval] = useApproveCallback(parsedCurrentBalance, JACUZZI_ADDRESS[chainId ? chainId : ChainId.FUJI])

  const jacuzzi = useJacuzziContract()
  const yay = useYayContract()

  const userCanStake = useMemo(() => {
    const userApprovedYAYJacuzzi = account && approval && approval === ApprovalState.APPROVED
    const userHasYAYs = userYAYBalance > 0

    return userApprovedYAYJacuzzi && userHasYAYs
  }, [approval, userYAYBalance, account])

  const userCanLeave = useMemo(() => {
    const userApprovedYAYJacuzzi = account && approval && approval === ApprovalState.APPROVED
    const userHasxYAYs = userxYAYStake > 0

    return userApprovedYAYJacuzzi && userHasxYAYs
  }, [approval, userxYAYStake, account])

  const getRatio = useCallback(async () => {
    if (!jacuzzi || !yay) {
      return setRatio(0)
    }

    const balance = await yay.balanceOf(jacuzzi.address)
    const supply = await jacuzzi.totalSupply()
    if (supply.toString() === '0') {
      return setRatio(0)
    }

    const _ratio = balance.toString() / supply.toString()

    return setRatio(+_ratio.toFixed(3))
  }, [yay, jacuzzi])

  const getPenalty = useCallback(async () => {
    if (!jacuzzi || !yay) {
      return setEarlyLeavePenalty(0)
    }

    const _unlockDate = await jacuzzi.unlockDate()
    setUnlockDate(new Date(_unlockDate * 1000).toLocaleString())

    const maxWithdrawalFee = await jacuzzi.MAX_EARLY_WITHDRAW_FEE()
    const currentWithdrawalFee = await jacuzzi.earlyWithdrawalFee()

    const percentageFee = (100 * currentWithdrawalFee.toNumber()) / maxWithdrawalFee.toNumber()

    if (_unlockDate < new Date().getTime()) {
      setEarlyLeavePenaltyAfterUnlockDate(percentageFee)
      return setEarlyLeavePenalty(0)
    }
    return setEarlyLeavePenalty(percentageFee)
  }, [jacuzzi, yay])

  const getUserBalances = useCallback(async () => {
    if (!jacuzzi || !yay || !account) {
      setUserYAYStake(0)
      return setUserXYAYStake(0)
    }

    const userBalance = await yay.balanceOf(account)
    const jacuzziBalance = await jacuzzi.balanceOf(account)
    const totalSupply = await jacuzzi.totalSupply()
    const yayJacuzziBalance = await yay.balanceOf(JACUZZI_ADDRESS[chainId || ChainId.FUJI])
    let stakedYAY
    if (yayJacuzziBalance.toString() === '0') {
      stakedYAY = JSBI.BigInt(0)
    } else {
      stakedYAY = jacuzziBalance.mul(yayJacuzziBalance).div(totalSupply)
    }
    setUserYAYBalance(toFixedTwo(userBalance.toString()))
    setUserXYAYStake(toFixedTwo(jacuzziBalance.toString()))
    setUserYAYStake(toFixedTwo(stakedYAY.toString()))
  }, [jacuzzi, yay, account, chainId])

  const getContractBalances = useCallback(async () => {
    if (!jacuzzi || !yay) {
      setJacuzziXYAYStake(0)
      return setJacuzziYAYStake(0)
    }

    const totalSupply = await jacuzzi.totalSupply()
    const yayJacuzziBalance = await yay.balanceOf(JACUZZI_ADDRESS[chainId || ChainId.FUJI])
    setJacuzziXYAYStake(toFixedTwo(totalSupply.toString()))
    setJacuzziYAYStake(toFixedTwo(yayJacuzziBalance.toString()))
  }, [jacuzzi, yay, chainId])

  const handleStake = async () => {
    setStakeModalOpen(true)
  }
  const handleLeave = async () => {
    setUnstakeModalOpen(true)
  }

  useEffect(() => {
    getRatio()
    getPenalty()
    getUserBalances()
    getContractBalances()
  }, [getRatio, getPenalty, getUserBalances, getContractBalances, confirmed])

  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval])

  return (
    <Wrapper>
      <div className="jacuzzi">
        <div className="jacuzzi-background"></div>
        <div className="jacuzzi-container">
          <div className="jacuzzi-media">
            <JacuzziImage />
          </div>
          <div className="poolsGrid-item">
            <div className="poolsGrid-item-content">
              <div className="poolsGrid-item-header">
                <PoolIcon />
                <div>
                  <h4>xYAY Pool</h4>
                  <div className="poolsGrid-item-header-features">
                    <span>
                      <BadgeIcon /> Core
                    </span>
                    <span>160X</span>
                  </div>
                </div>
              </div>
              <div className="poolsGrid-item-table">
                <p>
                  APR: <span>500.00%</span>
                </p>
                <p>
                  xYAY to YAY: <span>{ratio}</span>
                </p>
                <p>
                  Paper Hands Penalty: <span>25%</span>
                </p>
              </div>
              <div className="poolsGrid-item-grid">
                <div>
                  <p>YAY earned</p>
                  <p>0.000</p>
                </div>
                <div>
                  <button className="btn btn-secondary">Collect</button>
                </div>
              </div>
              <div className="poolsGrid-item-grid">
                <div>
                  <p>YAY staked</p>
                  <p>0.000</p>
                </div>
                <div>
                  <button className="btn btn-secondary">+ | -</button>
                </div>
              </div>

              <button className="btn btn-secondary">Unlock Wallet</button>
            </div>
            <div className="grid-item-details">
              <details>
                <summary>
                  <span className="grid-item-details-btn">
                    Details
                    <ArrowDown />
                  </span>
                </summary>
                <div className="poolsGrid-item-table">
                  <p>
                    Total Liquidity: <span>$643,936</span>
                  </p>
                  <a href="https://avascan.info/">
                    See Token Info <ExtLink />
                  </a>
                  <a href="https://avascan.info/">
                    View Project Site <ExtLink />
                  </a>
                  <a href="https://avascan.info/">
                    View Contract <ExtLink />
                  </a>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
      <JacuzziCard>
        YAY Pool
        {!approvalSubmitted && (
          <>
            {approval === ApprovalState.NOT_APPROVED && (
              <ButtonPrimary onClick={handleAprove}>Approve YAY</ButtonPrimary>
            )}
          </>
        )}
        <div>
          <div>{userCanStake ? <ButtonPrimary onClick={handleStake}>Stake</ButtonPrimary> : ''}</div>
          <div>{userCanLeave ? <ButtonPrimary onClick={handleLeave}>Leave</ButtonPrimary> : ''}</div>
        </div>
        <div>xYAY to YAY: {ratio}</div>
        <div>
          Paper hands penalty: {earlyLeavePenaltyAfterUnlockDate}% right now ({earlyLeavePenalty}% after {unlockDate})
        </div>
        <div>
          Your Stake:
          <div>xYAY: {userxYAYStake}</div>
          <div>YAY: {userYAYStake}</div>
        </div>
        <div>
          Total Stake:
          <div>xYAY: {jacuzziXYAYStake}</div>
          <div>YAY: {jacuzziYAYStake}</div>
        </div>
        <JacuzziStakingModal isOpen={stakeModalOpen} onDismiss={() => setStakeModalOpen(false)} />
        <JacuzziLeaveModal isOpen={unstakeModalOpen} onDismiss={() => setUnstakeModalOpen(false)} />
      </JacuzziCard>
    </Wrapper>
  )
}
