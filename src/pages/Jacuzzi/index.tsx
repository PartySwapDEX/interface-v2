import { ChainId, JSBI, Token, TokenAmount } from '@partyswap-libs/sdk'
import { ethers } from 'ethers'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Box } from 'rebass'
import styled, { ThemeContext } from 'styled-components'
import { ReactComponent as ArrowDown } from '../../assets/svg/arrow-down.svg'
import { ReactComponent as BadgeSVG } from '../../assets/svg/badge.svg'
import { ReactComponent as ExternalLinkSVG } from '../../assets/svg/external-link.svg'
import JacuzziImageDark from '../../assets/svg/jacuzzi-hero-dark.svg'
import JacuzziImage from '../../assets/svg/jacuzzi-hero.svg'
import JacuzziTokenImage from '../../assets/svg/jacuzzi-token.svg'
import patternDarkMode from '../../assets/svg/swap-pattern-dark.svg'
import pattern from '../../assets/svg/swap-pattern.svg'
import { ButtonPrimary } from '../../components/Button'
import JacuzziLeaveModal from '../../components/jacuzzi/JacuzziLeaveModal'
import JacuzziStakingModal from '../../components/jacuzzi/JacuzziStakingModal'
import { VersionTabs } from '../../components/NavigationTabs'
import QuestionHelper from '../../components/QuestionHelper'
import { RowBetween } from '../../components/Row'
import { newTransactionsFirst } from '../../components/Web3Status'
import { JACUZZI_ADDRESS, PARTY, PARTY_DECIMALS_DIVISOR, toFixed, toFixedTwo } from '../../constants'
import { useActiveWeb3React } from '../../hooks'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { useJacuzziContract, usePartyContract } from '../../hooks/useContract'
import { isTransactionRecent, useAllTransactions } from '../../state/transactions/hooks'
import { useIsDarkMode } from '../../state/user/hooks'
import { TYPE } from '../../theme'
import { createJacuzziTokenInstance } from '../../utils/token'

const Wrapper = styled.div`
  width: 100vw;
  background-color: ${({ theme }) => theme.surface3};
`

const BackgroundImage = styled.div`
  position: absolute;
  background-color: #f6f6ff;
  background-image: url(${pattern});
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  &.darkMode {
    background-color: #1a1a37;
    background-image: url(${patternDarkMode});
  }
`

const Item = styled.div`
  background-color: ${({ theme }) => theme.surface6};
  [class*='-item-header'] h4 {
    color: ${({ theme }) => theme.text1};
  }
  .poolsGrid-item-header-features span {
    background-color: ${({ theme }) => theme.primaryText2};
    border: 2px solid ${({ theme }) => theme.primaryText2};
  }
  .poolsGrid-item-header-features span:nth-child(1) {
    color: ${({ theme }) => theme.primaryText2};
    border-color: ${({ theme }) => theme.primaryText2};
    background-color: transparent;
  }
  .poolsGrid-item-grid p:nth-child(1) {
    color: ${({ theme }) => theme.text6};
  }
  .grid-item-details {
    background-color: ${({ theme }) => theme.surface5};
  }
  .grid-item-details-btn {
    color: ${({ theme }) => theme.primaryText3};
  }
  .grid-item-details-btn svg {
    fill: ${({ theme }) => theme.primaryText3};
  }
  .grid-item-details .poolsGrid-item-table span {
    color: ${({ theme }) => theme.text1};
  }
  .grid-item-details .poolsGrid-item-table a {
    color: ${({ theme }) => theme.primaryText3};
  }
  .poolsGrid-item-table a div {
    cursor: pointer;
  }
`

const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  position: relative;
  & :nth-child(1) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  & :nth-child(2) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  ::after {
    content: '';
    position: absolute;
    width: 1px;
    height: 100%;
    background-color: ${({ theme }) => theme.primaryText3};
    left: 0;
    right: 0;
    margin: auto;
    z-index: 2;
  }
`

const ExtLink = styled(ExternalLinkSVG)`
  margin-left: 0.125em;
`

const BadgeIcon = styled(BadgeSVG)`
  margin-right: 0.125em;
`

const HelperCard = styled.div`
  border-radius: 3rem;
  display: flex;
  flex-direction: column;

  .title {
    margin-bottom: 1rem;
  }

  .content {
    margin-bottom: 1rem;
  }

  a:hover {
    text-decoration: none;
  }
`

export default function Jacuzzi() {
  const theme = useContext(ThemeContext)
  const { chainId, account } = useActiveWeb3React()
  const [approvalSubmitted, setApprovalSubmitted] = useState(false)
  const [ratio, setRatio] = useState(0)
  const [, setEarlyLeavePenalty] = useState(0)
  const [earlyLeavePenaltyAfterUnlockDate, setEarlyLeavePenaltyAfterUnlockDate] = useState(0)
  const [, setUnlockDate] = useState(new Date().toLocaleString())
  const [userPARTYBalance, setUserPARTYBalance] = useState(0)
  const [userxPARTYStake, setUserxPARTYStake] = useState(0)
  const [jacuzziPARTYStake, setJacuzziPARTYStake] = useState(0)
  const [stakeModalOpen, setStakeModalOpen] = useState(false)
  const [unstakeModalOpen, setUnstakeModalOpen] = useState(false)

  const [displayTotalLiquidity, setDisplayTotalLiquidity] = useState('')
  const [displayTotalSupply, setDisplayTotalsupply] = useState('')
  const [displayUserTotalLiquidity, setDisplayUserTotalLiquidity] = useState('')
  const [displayUserTotalSupply, setDisplayUserTotalsupply] = useState('')

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const confirmed = useMemo(() => sortedRecentTransactions.filter((tx: any) => tx.receipt).map((tx: any) => tx.hash), [
    sortedRecentTransactions
  ])

  const parsedMaxAmount = new TokenAmount(
    PARTY[chainId ? chainId : ChainId.AVALANCHE],
    JSBI.BigInt(ethers.constants.MaxUint256)
  )
  const parsedCurrentBalance = new TokenAmount(
    PARTY[chainId ? chainId : ChainId.AVALANCHE],
    JSBI.BigInt(userPARTYBalance * PARTY_DECIMALS_DIVISOR)
  )

  const [, handleAprove] = useApproveCallback(parsedMaxAmount, JACUZZI_ADDRESS[chainId ? chainId : ChainId.AVALANCHE])
  const [approval] = useApproveCallback(parsedCurrentBalance, JACUZZI_ADDRESS[chainId ? chainId : ChainId.AVALANCHE])

  const jacuzzi = useJacuzziContract()
  const party = usePartyContract()

  const userCanStake = useMemo(() => {
    const userApprovedPARTYJacuzzi = account && approval && approval === ApprovalState.APPROVED
    const userHasPARTYs = userPARTYBalance > 0

    return userApprovedPARTYJacuzzi && userHasPARTYs
  }, [approval, userPARTYBalance, account])

  const userCanUnstake = useMemo(() => {
    const userApprovedPARTYJacuzzi = account && approval && approval === ApprovalState.APPROVED
    const userHasxPARTYs = userxPARTYStake > 0

    return userApprovedPARTYJacuzzi && userHasxPARTYs
  }, [approval, userxPARTYStake, account])

  const getRatio = useCallback(async () => {
    if (!jacuzzi || !party) {
      return setRatio(0)
    }

    const balance = await party.balanceOf(jacuzzi.address)
    const supply = await jacuzzi.totalSupply()
    if (supply.toString() === '0') {
      return setRatio(0)
    }

    const _ratio = balance.toString() / supply.toString()

    return setRatio(+_ratio.toFixed(3))
  }, [party, jacuzzi])

  const getPenalty = useCallback(async () => {
    if (!jacuzzi || !party) {
      return setEarlyLeavePenalty(0)
    }

    const _unlockDate = await jacuzzi.unlockDate()
    setUnlockDate(new Date(_unlockDate * 1000).toLocaleString())

    const maxWithdrawalFee = await jacuzzi.MAX_EARLY_WITHDRAW_FEE_PERCENTAGE_BASE()
    const currentWithdrawalFee = await jacuzzi.earlyWithdrawalFeePortionFromPercentageBase()

    const percentageFee = (100 * currentWithdrawalFee.toNumber()) / maxWithdrawalFee.toNumber()

    if (_unlockDate < new Date().getTime()) {
      setEarlyLeavePenaltyAfterUnlockDate(percentageFee)
      return setEarlyLeavePenalty(0)
    }
    return setEarlyLeavePenalty(percentageFee)
  }, [jacuzzi, party])

  const createPARTYTokenInstance = useCallback(() => {
    return new Token(chainId || ChainId.AVALANCHE, PARTY[chainId || ChainId.AVALANCHE].address, 18, 'PARTY', 'PARTY')
  }, [chainId])

  const getUserBalances = useCallback(async () => {
    if (!jacuzzi || !party || !account) {
      setDisplayUserTotalLiquidity('0')
      return setDisplayUserTotalsupply('0')
    }

    const userBalance = await party.balanceOf(account)
    const jacuzziBalance = await jacuzzi.balanceOf(account)

    const userXpartyToPARTY = +jacuzziBalance?.toString() * ratio

    setUserPARTYBalance(toFixedTwo(userBalance.toString()))
    setUserxPARTYStake(toFixed(jacuzziBalance.toString(), 10))

    setDisplayUserTotalLiquidity(
      new TokenAmount(createPARTYTokenInstance(), JSBI.BigInt(userXpartyToPARTY)).toFixed(2, { groupSeparator: ',' })
    )
    setDisplayUserTotalsupply(
      new TokenAmount(createJacuzziTokenInstance(chainId), jacuzziBalance).toFixed(2, { groupSeparator: ',' })
    )
  }, [chainId, ratio, jacuzzi, party, account, createPARTYTokenInstance])

  const getContractBalances = useCallback(async () => {
    if (!jacuzzi || !party) {
      setDisplayTotalsupply('0')
      return setJacuzziPARTYStake(0)
    }

    const partyJacuzziBalance = await party.balanceOf(JACUZZI_ADDRESS[chainId || ChainId.AVALANCHE])
    setJacuzziPARTYStake(toFixedTwo(partyJacuzziBalance.toString()))

    const supply = await jacuzzi.totalSupply()

    setDisplayTotalLiquidity(
      new TokenAmount(createPARTYTokenInstance(), partyJacuzziBalance).toFixed(2, { groupSeparator: ',' })
    )
    setDisplayTotalsupply(
      new TokenAmount(createJacuzziTokenInstance(chainId), supply).toFixed(2, { groupSeparator: ',' })
    )
  }, [jacuzzi, party, chainId, createPARTYTokenInstance])

  const apr = useMemo(() => {
    const TOKENS_PER_DAY = 40000
    const HALVING_CYCLE_DAYS = 30
    if (!jacuzziPARTYStake) {
      return 0
    }

    const today = Date.now()
    const firstHalvingDay = Date.UTC(2021, 10, 24)
    const passedHalvingCycles = (today - firstHalvingDay) / (HALVING_CYCLE_DAYS * 24 * 60 * 60 * 1000)
    let roi = 0

    for (let i = 0; i < 365; i++) {
      const passedHalvingCyclesInYear = i / HALVING_CYCLE_DAYS
      const totalHalvingCycles = Math.floor(passedHalvingCyclesInYear + passedHalvingCycles)
      roi = roi + TOKENS_PER_DAY / (jacuzziPARTYStake * Math.pow(4 / 3, totalHalvingCycles))
    }

    return (roi * 100).toFixed(2)
  }, [jacuzziPARTYStake])

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

  const isDarkMode = useIsDarkMode()

  return (
    <Wrapper>
      <JacuzziStakingModal isOpen={stakeModalOpen} onDismiss={() => setStakeModalOpen(false)} />
      <JacuzziLeaveModal isOpen={unstakeModalOpen} onDismiss={() => setUnstakeModalOpen(false)} />
      <div className="jacuzzi">
        {isDarkMode ? <BackgroundImage className="darkMode" /> : <BackgroundImage />}
        <VersionTabs active={'v2'} pathname="/jacuzzi" />
        <div className="jacuzzi-container">
          <div className="jacuzzi-media">
            {isDarkMode ? <img src={JacuzziImageDark} alt="Jacuzzi dark" /> : <img src={JacuzziImage} alt="Jacuzzi" />}
          </div>
          <Item className="poolsGrid-item">
            <div className="poolsGrid-item-content">
              <div className="poolsGrid-item-header">
                <img src={JacuzziTokenImage} alt="$PARTY token" />
                <div>
                  <h4>PARTY Pool</h4>
                  <div className="poolsGrid-item-header-features">
                    <span>
                      <BadgeIcon /> Core
                    </span>
                    <span>160X</span>
                  </div>
                </div>
              </div>
              <div className="poolsGrid-item-table">
                <RowBetween mb="0.5rem">
                  <Box>APR:</Box>
                  <Box>
                    <span>{apr}%</span>
                    <a
                      target="_blank"
                      href="https://partyswap.gitbook.io/partyswap/jacuzzis/apr-calculation"
                      rel="noopener noreferrer"
                    >
                      <QuestionHelper text="Click on the icon to learn how we get this value." />
                    </a>
                  </Box>
                </RowBetween>
                <p>
                  xPARTY to PARTY: <span>{ratio}</span>
                </p>
                <p>
                  Paper Hands Penalty: <span>{earlyLeavePenaltyAfterUnlockDate}%</span>
                </p>
              </div>
              <div className="poolsGrid-item-grid">
                <div>
                  <p>xPARTY Staked</p>
                  <p>{displayUserTotalSupply}</p>
                </div>
                <div>
                  <p>PARTY Equivalent</p>
                  <p>{displayUserTotalLiquidity}</p>
                </div>
              </div>
              {!approvalSubmitted && (
                <>
                  {approval === ApprovalState.NOT_APPROVED && (
                    <ButtonPrimary onClick={handleAprove}>Approve PARTY</ButtonPrimary>
                  )}
                </>
              )}
              {userCanStake || userCanUnstake ? (
                <ButtonGroup>
                  <ButtonPrimary onClick={handleStake} disabled={!userCanStake}>
                    Add
                  </ButtonPrimary>
                  <ButtonPrimary onClick={handleLeave} disabled={!userCanUnstake}>
                    Remove
                  </ButtonPrimary>
                </ButtonGroup>
              ) : (
                <HelperCard>
                  <TYPE.largeHeader fontSize="20px" color={theme.text1} className="title">
                    Get some PARTY tokens (PARTY)
                  </TYPE.largeHeader>
                  <TYPE.body color={theme.text1} className="content">
                    PARTY tokens are required. Once you've acquired some PARTY tokens you can stake them in the jacuzzi.
                  </TYPE.body>
                  <Link to="swap">
                    <ButtonPrimary>Get PARTY Tokens</ButtonPrimary>
                  </Link>
                </HelperCard>
              )}
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
                    Total Liquidity: <span> {displayTotalLiquidity} PARTY</span>
                  </p>
                  <p>
                    Total xPARTY Supply: <span>{displayTotalSupply}</span>
                  </p>
                  <a
                    href="https://cchain.explorer.avax.network/tokens/0x99c904CC0E919867404B49a804d30473E8344b1C/token-transfers"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    See Token Info <ExtLink />
                  </a>
                  <a href="https://partyswap.gitbook.io/partyswap/jacuzzis" target="_blank" rel="noopener noreferrer">
                    How it works <ExtLink />
                  </a>
                </div>
              </details>
            </div>
          </Item>
        </div>
      </div>
    </Wrapper>
  )
}
