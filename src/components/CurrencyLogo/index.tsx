import { Currency, CAVAX, Token } from '@partyswap-libs/sdk'
import React, { useMemo } from 'react'
import styled from 'styled-components'

import AvaxLogo from '../../assets/images/avalanche_token_round.png'
import useHttpLocations from '../../hooks/useHttpLocations'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import Logo from '../Logo'

export const getTokenLogoURL = (address: string, usePartyUrl: boolean = false) =>
  usePartyUrl
    ? `https://raw.githubusercontent.com/PartySwapDEX/token-assets/main/assets/${address}/logo.png`
    : `https://raw.githubusercontent.com/pangolindex/tokens/main/assets/${address}/logo.png`

const StyledEthereumLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
`

export default function CurrencyLogo({
  currency,
  size = '24px',
  style
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

  const srcs: string[] = useMemo(() => {
    if (currency === CAVAX) return []
    if (currency instanceof Token) {
      const v2 = currency.name === 'PARTY V2'
      const partyLogoUrl = v2
        ? getTokenLogoURL('0x25afD99fcB474D7C336A2971F26966da652a92bc', true)
        : getTokenLogoURL('0x15957be9802B50c6D66f58a99A2a3d73F5aaf615', true)
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, currency.symbol === 'PARTY' ? partyLogoUrl : getTokenLogoURL(currency.address)]
      }

      return [...uriLocations, currency.symbol === 'PARTY' ? partyLogoUrl : getTokenLogoURL(currency.address)]
    }
    return []
  }, [currency, uriLocations])

  if (currency === CAVAX) {
    return <StyledEthereumLogo src={AvaxLogo} size={size} style={style} />
  }

  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}
