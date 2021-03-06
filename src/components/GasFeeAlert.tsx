import React, { useContext } from 'react'
import Column, { AutoColumn } from './Column'
import styled, { ThemeContext } from 'styled-components'
import { transparentize } from 'polished'
import { AlertTriangle } from 'react-feather'
import { TYPE } from '../theme'
import { RowFixed } from './Row'
import { GAS_PRICE } from '../constants'

export const GasFee = styled(AutoColumn)`
  background-color: ${({ theme }) => transparentize(0.9, theme.primary1)};
  color: ${({ theme }) => theme.primary1};
  padding: 0.5rem;
  border-radius: 12px;
  margin-top: 8px;
`

export default function GasFeeAlert() {
	const theme = useContext(ThemeContext)

	return (
		<GasFee style={{ margin: '1rem' }} justify="flex-start" gap={'0px'}>
			<RowFixed>
				<AlertTriangle size={20} style={{ marginRight: '8px', minWidth: 24 }} />
				<Column>
					<TYPE.body color={theme.text7} >Gas Fee Reduction!!!<br/></TYPE.body>
					<TYPE.body color={theme.text7}>Transactions will not be accepted unless the gas fee is set to {GAS_PRICE} gwei.</TYPE.body>
				</Column>
			</RowFixed>
		</GasFee>
	)
}
