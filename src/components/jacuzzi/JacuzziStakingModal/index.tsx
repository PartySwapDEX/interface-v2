import React, { useEffect, useState, useCallback } from 'react'
import Modal from '../../Modal'
import { AutoColumn } from '../../Column'
import styled from 'styled-components'
import { RowBetween } from '../../Row'
import { TYPE, CloseIcon } from '../../../theme'
import { ButtonPrimary } from '../../../components/Button'
import { useActiveWeb3React } from '../../../hooks'
import { useJacuzziContract, usePartyContract } from '../../../hooks/useContract'
import { PARTY, toFixed } from '../../../constants'
import { useTransactionAdder } from '../../../state/transactions/hooks'
import { tryParseAmount } from '../../../state/swap/hooks'
import { ChainId } from '@partyswap-libs/sdk'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 1.5rem;
`

const StakeAmount = styled(RowBetween)`
  display: grid;
  grid-template-columns: 5rem 1fr;
  gap: 1.5rem;
  background-color: ${({ theme }) => theme.surface5};
  border: 2px solid ${({ theme }) => theme.bg7};
  border-radius: 1.25rem;
  padding: 1rem 1rem;
  button {
    font-size: 1rem;
    padding: 0.75rem 1rem;
    background-color: ${({ theme }) => theme.primaryText3};
    border: 2px solid ${({ theme }) => theme.primaryText3};
    border-radius: 1.5rem;
    color: #fff;
    &:hover,
    &:focus {
      background-color: ${({ theme }) => theme.primary1};
      border-color: ${({ theme }) => theme.primary1};
    }
  }
  > * {
    height: 100%;
  }
`

const StakeInput = styled.input`
  color: ${({ theme }) => theme.text1};
  background-color: transparent;
  border: none;
  padding: 0.5rem;
  font-size: 15px;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
`

interface StakingModalProps {
  isOpen: boolean
  onDismiss: () => void
}

export default function JacuzziStakingModal({ isOpen, onDismiss }: StakingModalProps) {
  const { chainId, account } = useActiveWeb3React()

  // track and parse user input
  const [typedValue, setTypedValue] = useState('0')
  const [balance, setBalance] = useState('0')
  const party = usePartyContract()
  const jacuzzi = useJacuzziContract()
  const addTransaction = useTransactionAdder()

  const parsedAmmount = tryParseAmount(typedValue, PARTY[chainId || ChainId.AVALANCHE])

  const handleSetMax = () => {
    setTypedValue(balance)
  }

  const handleStake = async () => {
    if (jacuzzi && parsedAmmount) {
      const txReceipt = await jacuzzi.enter(`0x${parsedAmmount?.raw.toString(16)}`)

      addTransaction(txReceipt, { summary: `Stake ${typedValue} PARTY to Jacuzzi` })
      onDismiss()
    }
  }

  const getUserBalance = useCallback(async () => {
    if (!chainId || !account || !party) {
      return
    }

    const userBalance = await party.balanceOf(account)
    setBalance(toFixed(userBalance.toString(), 8).toString())
  }, [chainId, account, party])

  useEffect(() => {
    if (isOpen) {
      getUserBalance()
    }

    return () => {
      setTypedValue(() => '0')
    }
  }, [getUserBalance, isOpen])

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={90}>
      <ContentWrapper gap="lg">
        <RowBetween>
          <TYPE.largeHeader>Stake</TYPE.largeHeader>
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
        <RowBetween>Your balance: {balance} PARTY</RowBetween>
        <StakeAmount>
          <button onClick={handleSetMax}>MAX</button>

          <StakeInput name="value_to_stake" value={typedValue} onChange={e => setTypedValue(e.target.value)} />
        </StakeAmount>
        <ButtonPrimary onClick={handleStake}>Stake</ButtonPrimary>
      </ContentWrapper>
    </Modal>
  )
}
