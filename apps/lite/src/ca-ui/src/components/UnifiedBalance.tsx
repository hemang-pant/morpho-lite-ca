import React from 'react';
import styled from 'styled-components';
import { IMAGE_LINKS } from '../utils/assetList';
import { formatNumber, getReadableNumber } from '../utils/commonFunction';
import { Accordion } from '@ark-ui/react';
import AppTooltip from './shared/Tooltip';
import Decimal from 'decimal.js';
import { darkTheme } from '../utils/theme';
import { useTheme } from './ThemeProvider';
import type { UserAsset } from '@arcana/ca-sdk';
import { useUnifiedBalance } from '../hooks/useUnifiedBalance';
import { useAccount } from 'wagmi';
import CopySVG from './shared/Copy';
import { MainContainerBase } from './shared/Container';

const MainContainer = styled(MainContainerBase)`
  margin: 0 auto;
`;

const PaddingContainer = styled.div`
  padding: 10px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  text-align: center;
  font-family: 'Nohami', sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.primaryColor};
  margin: 0;
  flex: 1;
`;

const CloseIcon = styled.span`
  cursor: pointer;
`;

const Img = styled.img`
  filter: ${({ theme }) => theme.footerImg};
`;

const BalanceCard = styled.div`
  margin-top: 1rem;
  border: 1px solid ${({ theme }) => theme.backgroundColor};
  padding: 2rem;
  border-radius: 8px;
  background: ${({ theme }) => theme.balanceCardBackGround};
`;

const AddressCard = styled.div`
  font-size: 0.75rem;
  font-weight: 400;
  font-family: 'Inter', sans-serif;
  line-height: 12px;
  display: flex;
  color: ${({ theme }) => theme.primaryColor};
  fill: currentColor;
  gap: 0.2rem;
  justify-content: center;
`;

const Balance = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 2rem;
  color: ${({ theme }) => theme.primaryColor};
  font-weight: 600;
  text-align: center;
`;

const Item = styled(Accordion.Item)``;

const Header2 = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const LeftContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const TokenIconContainer = styled.div`
  position: relative;
  display: flex;
  gap: 1rem;
`;

const TokenInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const TokenWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TokenSymbolTitle = styled.span<{ $isdarkmode: boolean }>`
  max-width: 6ch;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: ${({ $isdarkmode, theme }) =>
    $isdarkmode ? darkTheme.chainAbsTitle : theme.primaryColor};
`;

const TokenSymbol = styled.span`
  max-width: 6ch;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.primaryColor};
`;

const TokenSymbolChainAbs = styled.span`
  max-width: 6ch;
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 400;
  color: ${({ theme }) => theme.primaryColor};
`;

const TokenBalance = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  max-width: 10rem;
`;

const BalanceAmount = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.primaryColor};
`;

const BalanceAmountChainAbs = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 400;
  color: ${({ theme }) => theme.primaryColor};
`;

const ViewBreakupButton = styled(Accordion.ItemTrigger)`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 400;
  color: ${({ theme }) => theme.secondaryColor};
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  outline: none;

  &:focus {
    outline: none;
  }
`;

const AssetIcon = styled.img`
  height: 2rem;
  width: 2rem;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.backgroundColor};
`;

const BreakdownAssetIcon = styled.img`
  height: 28px;
  width: 28px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.backgroundColor};
`;

const ItemIndicator = styled(Accordion.ItemIndicator)`
  height: 15px;
  width: 15px;
  margin-top: 2px;
  cursor: pointer;
  display: flex;
`;

const ItemContent = styled(Accordion.ItemContent)`
  padding-top: 1rem;
`;

const BreakdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.chainAbsBackGround};
`;

const BreakdownItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BreakdownToken = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RelativeContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const BreakdownTokenSymbol = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  color: ${({ theme }) => theme.primaryColor};
`;

const BreakDownChainSymbol = styled.span<{ $isdarkmode: boolean }>`
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 400;
  color: ${({ theme }) => theme.primaryTitleColor};
  color: ${({ $isdarkmode, theme }) =>
    $isdarkmode ? darkTheme.secondaryTitleColor : theme.primaryTitleColor};
`;

const Root = styled(Accordion.Root)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  padding: 1rem;
`;

const CurrencySmall = styled.span`
  font-weight: 600;
  font-size: 2rem;
  font-family: 'Inter', sans-serif;
`;
const CurrencyLarge = styled.span`
  font-weight: 600;
  font-size: 3rem;
  font-family: 'Inter', sans-serif;
`;

const TokenIcon = styled.img<{ length: number; index: number }>`
  position: absolute;
  border-radius: 50%;
  border: solid 1px ${({ theme }) => theme.infoColor};
  ${(props) =>
    props.length > 1
      ? `
        height: 0.625rem;
        width: 0.625rem;
      `
      : `
        height: 0.875rem;
        width: 0.875rem;
        bottom: -0.25rem;
        right: -0.25rem;
      `}
  ${(props) => (props.index === 0 && props.length > 1 ? `right: 0; bottom: -0.25rem;` : '')}
  ${(props) => (props.index === 1 && props.length > 1 ? `bottom: 0; right: -0.25rem;` : '')}
  ${(props) => (props.index === 2 && props.length > 1 ? `bottom: 0.375rem; right: -0.375rem;` : '')}
  z-index: ${(props) => props.index + 1};
`;

const Badge = styled.div<{ length: number }>`
  position: absolute;
  border-radius: 50%;
  border: solid 1px ${({ theme }) => theme.infoColor};
  background-color: ${({ theme }) => theme.infoBackground};
  ${(props) =>
    props.length > 1
      ? `
        height: 0.625rem;
        width: 0.625rem;
      `
      : `
        height: 0.875rem;
        width: 0.875rem;
      `}
  bottom: 0.375rem;
  right: -0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${(props) => props.length};
`;

const BadgeText = styled.span`
  font-size: 0.25rem;
  color: ${({ theme }) => theme.infoColor};
  font-weight: 600;
  font-family: 'Inter', sans-serif;
`;
const BreakdownCard = styled.div`
  margin-top: 2rem;
  border: 1px solid ${({ theme }) => theme.backgroundColor};
  padding: 0.2rem;
  background: ${({ theme }) => theme.cardDetailsBackGround};
  border-radius: 8px;
`;

const ChainAbstractedContainer = styled.div<{ $isdarkmode: boolean }>`
  color: ${({ theme }) => theme.chainAbsColor};
  font-size: 0.625rem;
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.45rem;

  border-radius: 9999px;
  background: ${({ $isdarkmode, theme }) =>
    $isdarkmode ? darkTheme.chainAbsDetailsColor : theme.backgroundColor};
`;

const InfoImg = styled.img`
  filter: ${({ theme }) => theme.footerImg};
`;

const ChainLogo = styled.img`
  position: absolute;
  bottom: -4px;
  right: -4px;
  z-index: 50;
  height: 14px;
  width: 14px;
  border-radius: 50%;
  border: 1px solid #ffffff;
`;

interface UnifiedBalanceComponentProps {
  close: () => void;
  $display: boolean;
}

const message = `These are CA or Chain Abstracted balances.
The Arcana Chain Abstraction protocol unifies the
asset's balances across the different chains.
`;

const UnifiedBalance: React.FC<UnifiedBalanceComponentProps> = ({ close, $display }) => {
  const { address } = useAccount();
  const { isDarkMode } = useTheme();
  const { balances } = useUnifiedBalance();

  const getBreakdownImageArray = (breakdown: UserAsset['breakdown']) => {
    const length = breakdown.length;
    const spliceLength = length > 3 ? 2 : length;
    return [...breakdown].slice(0, spliceLength);
  };

  const [total, setTotal] = React.useState(0);

  React.useEffect(() => {
    let t = new Decimal(0);
    if (balances.length) {
      for (const b of balances) {
        t = t.add(b.balanceInFiat);
      }
      setTotal(t.toNumber());
    }
  }, [balances]);

  if (!address) {
    return <></>;
  }
  return (
    <MainContainer $display={$display}>
      <PaddingContainer>
        <Header>
          <Title>Unified Balance</Title>
          <CloseIcon onClick={close}>
            <Img src={IMAGE_LINKS['close']} alt="Description Image" height={20} width={20} />
          </CloseIcon>
        </Header>

        <BalanceCard>
          <Balance>
            <CurrencySmall>$</CurrencySmall>
            <CurrencyLarge>{total.toString().split('.')[0]}.</CurrencyLarge>
            <CurrencySmall>{total.toString().split('.')[1]}</CurrencySmall>
          </Balance>
          <AddressCard>
            <AppTooltip message={address} $full={true}>
              <span>{truncateMid(address!)}</span>
            </AppTooltip>
            <AppTooltip message="Click to copy">
              <CopySVG address={address!} />
            </AppTooltip>
          </AddressCard>
        </BalanceCard>
        <BreakdownCard>
          <Root collapsible>
            {balances.length > 0 &&
              balances.map((asset, i) => (
                <Item value={JSON.stringify(asset.breakdown)} key={i}>
                  <Header2>
                    <LeftContent>
                      <TokenIconContainer>
                        <AssetIcon src={asset.icon} alt="Logo" />
                        {getBreakdownImageArray(asset.breakdown).map((b, index) => (
                          <TokenIcon
                            key={b.chain.id}
                            src={b.chain.logo}
                            alt="Logo"
                            length={asset.breakdown.length}
                            index={index}
                          />
                        ))}
                        {asset.breakdown.length > 3 && (
                          <Badge length={asset.breakdown.length}>
                            <BadgeText>
                              {asset.breakdown.length > 11
                                ? '+9'
                                : `+${asset.breakdown.length - 2}`}
                            </BadgeText>
                          </Badge>
                        )}
                      </TokenIconContainer>
                      <TokenInfo>
                        <TokenWrap>
                          <TokenSymbolTitle $isdarkmode={isDarkMode}>
                            {asset.symbol}
                          </TokenSymbolTitle>

                          {asset.abstracted && (
                            <AppTooltip message={message}>
                              <ChainAbstractedContainer $isdarkmode={isDarkMode}>
                                CA
                                <InfoImg
                                  src={IMAGE_LINKS['info']}
                                  alt="Info"
                                  height={10}
                                  width={10}
                                />
                              </ChainAbstractedContainer>
                            </AppTooltip>
                          )}
                        </TokenWrap>

                        <ViewBreakupButton>
                          <span>
                            {asset.breakdown.length} chain
                            {asset.breakdown.length > 1 ? 's' : ''}
                          </span>
                          <ItemIndicator>
                            <img src={IMAGE_LINKS['caret']} alt="Arrow" height={10} width={10} />
                          </ItemIndicator>
                        </ViewBreakupButton>
                      </TokenInfo>
                    </LeftContent>
                    <TokenBalance>
                      <AppTooltip
                        message={`$${formatNumber(asset.balanceInFiat)} (${new Decimal(
                          asset.balance
                        )} ${asset.symbol})`}
                      >
                        <BalanceAmount>
                          {getReadableNumber(asset.balance)}{' '}
                          <TokenSymbol>{asset.symbol}</TokenSymbol>
                        </BalanceAmount>
                      </AppTooltip>
                    </TokenBalance>
                  </Header2>
                  <ItemContent>
                    <BreakdownContainer>
                      {asset.breakdown.map((token, i) => (
                        <BreakdownItem key={i}>
                          <BreakdownToken>
                            <RelativeContainer>
                              <BreakdownAssetIcon src={asset.icon} alt="Logo" />
                              <ChainLogo src={token.chain.logo} alt="Chain Logo" />
                            </RelativeContainer>
                            <BreakdownTokenSymbol>{asset.symbol}</BreakdownTokenSymbol>
                            <BreakDownChainSymbol $isdarkmode={isDarkMode}>
                              {token.chain.name}
                            </BreakDownChainSymbol>
                          </BreakdownToken>

                          <AppTooltip
                            message={`$${formatNumber(token.balanceInFiat)} (${new Decimal(
                              token.balance
                            )} ${asset.symbol})`}
                          >
                            <BalanceAmountChainAbs>
                              {getReadableNumber(token.balance)}{' '}
                              <TokenSymbolChainAbs>{asset.symbol}</TokenSymbolChainAbs>
                            </BalanceAmountChainAbs>
                          </AppTooltip>
                        </BreakdownItem>
                      ))}
                    </BreakdownContainer>
                  </ItemContent>
                </Item>
              ))}
          </Root>
        </BreakdownCard>
      </PaddingContainer>
    </MainContainer>
  );
};

function truncateMid(str: string, maxChars = 6) {
  if (str.length <= maxChars) return str;
  const left = str.slice(0, maxChars);
  const right = str.slice(-maxChars);
  return `${left}.....${right}`;
}

export default UnifiedBalance;
