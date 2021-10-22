import { ChainId, TokenAmount } from '@partyswap-libs/sdk'
import { darken } from 'polished'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { Text } from 'rebass'
import styled from 'styled-components'
import { CountUp } from 'use-count-up'
import PartySwapIcon from '../../assets/svg/partyswapIcon.svg'
import V2Icon from '../../assets/svg/v2Icon.svg'
import { ANALYTICS_PAGE, TOKEN_MIGRATION_PAGE } from '../../constants'
import { useActiveWeb3React } from '../../hooks'
import usePrevious from '../../hooks/usePrevious'
import { useAggregatePartyBalance, useETHBalances } from '../../state/wallet/hooks'
import { ExternalLink, TYPE } from '../../theme'
import { RedCard } from '../Card'
import Menu from '../Menu'
import Modal from '../Modal'
import Row, { RowFixed } from '../Row'
import Settings from '../Settings'
import Web3Status from '../Web3Status'
import PartyBalanceContent from './PartyBalanceContent'

const HeaderFrame = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
  top: 0;
  position: relative;
  background-color: ${({ theme }) => theme.surface1};
  padding: 1rem;
  z-index: 2;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    padding: 1rem;
    width: calc(100%);
    position: relative;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 0.5rem 1rem;
  `}
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    flex-direction: row;
    justify-content: space-between;
    justify-self: center;
    width: 100%;
    padding: 1rem;
    position: fixed;
    bottom: 0px;
    left: 0px;
    z-index: 99;
    height: 72px;
    border-radius: 12px 12px 0 0;
    background-color: ${({ theme }) => theme.bg1};
  `};
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
   flex-direction: row-reverse;
    align-items: center;
  `};
`

const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;
`

const HeaderRow = styled(RowFixed)`
  ${({ theme }) => theme.mediaWidth.upToLarge`
   width: 100%;
   justify-content: space-between;
   z-index: 100;
  `};
`

const HeaderLinks = styled(Row)`
  justify-content: center;
  width: fit-content;
  .drawer {
    display: none;
  }
  .spread {
    display: flex;
  }
  @media (min-width: 1600px) {
    position: absolute;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
  }
  ${({ theme }) => theme.mediaWidth.upToLarge`
    position: relative;
    margin: 0;
  `};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 0;
    justify-content: flex-end;
    .drawer{
      display: flex;
    }
    .spread {
      display: none;
    }
  `};
`

const StyledBurger = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 1.5rem;
  height: 1.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 10;

  &:focus {
    outline: none;
  }

  div {
    width: 1.5rem;
    height: 2px;
    background: ${({ open }: { open: boolean }) => (open ? '#fff' : '#EFFFFA')};
    border-radius: 10px;
    transition: all 0.3s linear;
    position: relative;
    transform-origin: 1px;

    :first-child {
      transform: ${({ open }: { open: boolean }) => (open ? 'rotate(45deg)' : 'rotate(0)')};
    }

    :nth-child(2) {
      opacity: ${({ open }: { open: boolean }) => (open ? '0' : '1')};
      transform: ${({ open }: { open: boolean }) => (open ? 'translateX(20px)' : 'translateX(0)')};
    }

    :nth-child(3) {
      transform: ${({ open }: { open: boolean }) => (open ? 'rotate(-45deg)' : 'rotate(0)')};
    }
  }
`

const Burger = ({ open, setOpen, className }: { open: boolean; setOpen: any; className?: string }) => {
  return (
    <StyledBurger className={className} open={open} onClick={() => setOpen(!open)}>
      <div />
      <div />
      <div />
    </StyledBurger>
  )
}

const StyledMenu = styled.nav`
  display: none;
  flex-direction: column;
  justify-content: flex-start;
  background-color: ${({ theme }) => theme.surface1};
  transform: ${({ open }: { open: boolean }) => (open ? 'translateX(0)' : 'translateX(-100%)')};
  height: 100vh;
  width: 100%;
  text-align: left;
  padding: 15vh 2rem 2rem;
  position: absolute;
  top: 0;
  left: 0;
  transition: transform 200ms ease-out;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: flex;
  `};

  @media (max-width: 576px) {
    width: 100%;
  }

  a {
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans',
      sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
    font-size: 2rem;
    font-weight: 700;
    color: ${({ theme }) => theme.white};
    text-decoration: none;
    margin-bottom: 2rem;
    transition: color 100ms ease;

    @media (max-width: 576px) {
      font-size: 2rem;
      text-align: center;
    }

    &:hover {
      color: ${({ theme }) => theme.primaryText1};
    }
  }
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.primary8 : theme.primary10)};
  border: ${({ theme, active }) => (!active ? '' : `1px solid ${theme.primary8}`)};
  border-radius: 0.75rem;
  color: white;
  white-space: nowrap;
  width: 100%;
  cursor: pointer;
  font-size: 1rem;

  :focus {
    border: 1px solid blue;
  }
  :hover {
    background-color: ${({ theme, active }) => (!active ? theme.primary8 : theme.primary10)};
  }
`

const PNGAmount = styled(AccountElement)`
  color: white;
  padding: 8px 12px;
  font-weight: 500;
  background-color: ${({ theme }) => theme.primary8};
  border: none;
  font-size: 1rem;

  :hover {
    background-color: ${({ theme }) => theme.primary9};
  }
`

const PNGWrapper = styled.span`
  width: fit-content;
  position: relative;
  cursor: pointer;
`

const HideSmall = styled.span`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

const NetworkCard = styled(RedCard)`
  display: none;
  border-radius: 12px;
  padding: 8px 12px;
  background-color: ${({ theme }) => theme.primary1};
  color: #fff;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0;
    margin-right: 0.5rem;
    width: initial;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
  `};
`

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

const Title = styled.a`
  display: flex;
  position: relative;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 12px;
  img.logo {
    height: 2rem;
    margin-right: 3.25rem
  }
  img.logo-v2 {
    position: absolute;
    right: 0
    height: 2.5rem;
  }
  :hover {
    cursor: pointer;
  }
`

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans',
    sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  align-items: left;
  border-radius: 1.25rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.white};
  font-size: 0.9375rem;
  width: fit-content;
  font-weight: 500;

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.white)};
    text-decoration: none;
  }

  @media (min-width: 960px) {
    padding: 0.5rem 1rem;
    margin: 0 2px;

    &.${activeClassName} {
      background-color: ${({ theme }) => theme.primary1};
    }

    :hover,
    :focus {
      color: ${({ theme }) => theme.white};
      background-color: ${({ theme }) => theme.primary1};
    }
  }
`

const StyledExternalLink = styled(ExternalLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans',
    sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  align-items: left;
  border-radius: 1.25rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.white};
  font-size: 0.9375rem;
  width: fit-content;
  font-weight: 500;

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.white)};
    text-decoration: none;
  }

  @media (min-width: 960px) {
    padding: 0.5rem 1rem;
    margin: 0 2px;

    :hover,
    :focus {
      color: ${({ theme }) => theme.white};
      background-color: ${({ theme }) => theme.primary1};
    }
  }
`
const NETWORK_LABELS: { [chainId in ChainId]?: string } = {
  [ChainId.FUJI]: 'Fuji',
  [ChainId.AVALANCHE]: 'Avalanche'
}

const Links = ({ className }: { className?: string }) => {
  const { t } = useTranslation()

  return (
    <div className={className}>
      <StyledNavLink id={`swap-nav-link`} to={'/swap'}>
        {t('Swap')}
      </StyledNavLink>
      <StyledNavLink
        id={`pool-nav-link`}
        to={'/pool'}
        isActive={(match, { pathname }) =>
          Boolean(match) ||
          pathname.startsWith('/add') ||
          pathname.startsWith('/remove') ||
          pathname.startsWith('/create') ||
          pathname.startsWith('/find')
        }
      >
        Liquidity
      </StyledNavLink>
      <StyledNavLink id={`stake-nav-link`} to={'/party/1'}>
        Piñatas
      </StyledNavLink>
      <StyledNavLink id={`jacuzzi-nav-link`} to={'/jacuzzi'}>
        Jacuzzis
      </StyledNavLink>
      <StyledExternalLink href={ANALYTICS_PAGE}>Charts</StyledExternalLink>
      <StyledExternalLink href={TOKEN_MIGRATION_PAGE}>Migrate Token</StyledExternalLink>
    </div>
  )
}

const DrawerMenu = ({ open, onNavigate }: { open: boolean; onNavigate: () => void }) => {
  return (
    <StyledMenu open={open} onClick={() => onNavigate()}>
      <Links />
    </StyledMenu>
  )
}

export default function Header() {
  const { account, chainId } = useActiveWeb3React()

  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  // const [isDark] = useDarkModeManager()

  const aggregateBalance: TokenAmount | undefined = useAggregatePartyBalance()

  const [showPngBalanceModal, setShowPngBalanceModal] = useState(false)
  const [open, setOpen] = useState(false)

  const countUpValue = aggregateBalance?.toFixed(0) ?? '0'
  const countUpValuePrevious = usePrevious(countUpValue) ?? '0'

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <HeaderFrame>
      <DrawerMenu open={open} onNavigate={() => setOpen(false)} />
      <Modal isOpen={showPngBalanceModal} onDismiss={() => setShowPngBalanceModal(false)}>
        <PartyBalanceContent setShowPngBalanceModal={setShowPngBalanceModal} />
      </Modal>
      <HeaderRow>
        <Title href=".">
          <img src={PartySwapIcon} className="logo" alt="logo" />
          <img src={V2Icon} className="logo-v2" alt="logo-v2" />
        </Title>
        <HeaderLinks>
          <Burger className="drawer" open={open} setOpen={setOpen} />
          <Links className="spread" />
        </HeaderLinks>
      </HeaderRow>
      <HeaderControls>
        <HeaderElement>
          <HideSmall>
            {chainId && NETWORK_LABELS[chainId] && (
              <NetworkCard title={NETWORK_LABELS[chainId]}>{NETWORK_LABELS[chainId]}</NetworkCard>
            )}
          </HideSmall>
          {aggregateBalance && (
            <PNGWrapper onClick={() => setShowPngBalanceModal(true)}>
              <PNGAmount active={!!account} style={{ pointerEvents: 'auto' }}>
                {account && (
                  <HideSmall>
                    <TYPE.white
                      style={{
                        paddingRight: '.4rem'
                      }}
                    >
                      <CountUp
                        key={countUpValue}
                        isCounting
                        start={parseFloat(countUpValuePrevious)}
                        end={parseFloat(countUpValue)}
                        thousandsSeparator={','}
                        duration={1}
                      />
                    </TYPE.white>
                  </HideSmall>
                )}
                PARTY
              </PNGAmount>
            </PNGWrapper>
          )}
          <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
            {account && userEthBalance ? (
              <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                {userEthBalance?.toSignificant(3)} AVAX
              </BalanceText>
            ) : null}
            <Web3Status />
          </AccountElement>
        </HeaderElement>
        <HeaderElementWrap>
          <Settings />
          <Menu />
        </HeaderElementWrap>
      </HeaderControls>
    </HeaderFrame>
  )
}
