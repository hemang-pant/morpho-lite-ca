import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Accordion } from '@ark-ui/react';
import { getCoinbasePrices } from '../utils/coinbase';
import AppTooltip from './shared/Tooltip';
import { MainContainerBase } from './shared/Container';
import { IMAGE_LINKS } from '../utils/assetList';
import { getReadableNumber } from '../utils/commonFunction';
import type { Intent } from '@arcana/ca-sdk';
import { useUnifiedBalance } from '../hooks/useUnifiedBalance';
import Decimal from 'decimal.js';
import { supplyVal } from '@/components/earn-sheet-content';

const MainContainer = styled(MainContainerBase)``;
const Root = styled(Accordion.Root)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
`;

const AccordionWrapper = styled(Accordion.Item)`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;

const ItemIndicator = styled(Accordion.ItemIndicator)`
  width: 15px;
  margin-top: 2px;
  cursor: pointer;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const HeaderRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const TooltipMessage = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  color: ${({ theme }) => theme.secondaryTitleColor};
`;

const TotalFees = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.primaryColor};
`;

const TotalAtDestination = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.primaryTitleColor};
`;

const TotalFeesValue = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.primaryColor};
`;

const TotalAtDestinationValue = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.primaryTitleColor};
`;

const ViewBreakupButton = styled(Accordion.ItemTrigger)`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
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

// const AccordionContent = styled(Accordion.ItemContent)`
//   padding-top: 0.75rem;
// `;

const FeeDetails = styled.div`
  background: ${({ theme }) => theme.cardDetailsBackGround};
  border: ${({ theme }) => `1px solid ${theme.backgroundColor}`};
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FeeRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
`;

const Label = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  color: ${({ theme }) => theme.secondaryTitleColor};
`;

const Value = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.primaryColor};
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const Title = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  color: ${({ theme }) => theme.secondaryTitleColor};
`;

const ChainDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Chain = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.primaryColor};
`;

const Card = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${({ theme }) => theme.cardBackGround};
`;

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px; /* Space between items */
`;

const RelativeContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const Logo = styled.img`
  height: 28px;
  width: 28px;
  border-radius: 50%;
  background: #ffffff;
`;

const DestinationChainLogo = styled.img`
  height: 22px;
  width: 22px;
  border-radius: 50%;
  background: #ffffff;
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

const TokenDetails = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

const InfoImg = styled.img`
  filter: ${({ theme }) => theme.infoImg};
`;

const TokenName = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  color: ${({ theme }) => theme.primaryColor};
`;

const AllowanceAmount = styled.div`
  text-align: right;
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.primaryColor};
`;

const ButtonWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  margin-top: 20px;
  padding: 15px 20px;
  width: 100%;
  background: ${({ theme, variant }) =>
    variant === 'secondary' ? `transparent` : theme.primaryColor};
  color: ${({ theme, variant }) =>
    variant === 'secondary' ? theme.primaryColor : theme.buttonTextColor};
  border: ${({ theme }) => `2px solid ${theme.primaryColor}`};
  border-radius: 25px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  transition: background 0.3s ease;
  text-transform: uppercase;
  &:hover {
    background: ${({ theme }) => theme.primaryColor};
    color: ${({ theme }) => theme.buttonTextColor};
  }

  &:disabled {
    cursor: wait;
    opacity: 0.6;
  }
`;

const IntentView: React.FC<{
  intent?: Intent;
  deny: () => void;
  allow: () => void;
  intentRefreshing: boolean;
  $display: boolean;
}> = ({ allow, deny, intent, intentRefreshing, $display }) => {
  const [rates, setRates] = useState<Record<string, string>>({});
  const balances = useUnifiedBalance().balances;

  const [showFees, setShowFees] = useState(false);
  const [showSources, setShowSources] = useState(false);

  useEffect(() => {
    const fetchRates = async () => {
      const fetchedRates = await getCoinbasePrices();
      setRates(fetchedRates);
    };

    fetchRates();

    const interval = setInterval(() => {
      fetchRates();
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  if (!intent) {
    return <></>;
  };

  console.log('total: ',getReadableNumber(new Decimal(supplyVal()).add(intent.fees.total).toString()))
  console.log('inputVal:', supplyVal())

  return (
    <MainContainer $display={$display}>
      <Content>
        <Title>Destination</Title>
        <ChainDetails>
          <DestinationChainLogo src={intent.destination.chainLogo} alt="Chain Logo" />
          <Chain>{intent.destination.chainName}</Chain>
        </ChainDetails>
      </Content>
      <Root defaultValue={['sources']} collapsible>
        <AccordionWrapper key="sources" value="sources">
          <Header>
            <HeaderLeft>
              <TooltipMessage>Spend</TooltipMessage>
              <AppTooltip message="Total Spend">
                <InfoImg src={IMAGE_LINKS['info']} alt="Info" height={18} width={18} />
              </AppTooltip>
            </HeaderLeft>
            <HeaderRight>
              <TotalFees>
                {
(Number(intent.sourcesTotal || 0) / Number(rates[intent.token.symbol])).toString()       
}{' '}
                {intent?.token?.symbol}
              </TotalFees>
              {intent?.token?.symbol && rates?.[intent.token.symbol] && (
                <TotalAtDestination>
                  ~
                  {(Number(intent.sourcesTotal || 0) / Number(rates[intent.token.symbol])).toFixed(
                    2
                  )}{' '}
                  USD
                </TotalAtDestination>
              )}
              <ViewBreakupButton onClick={() => setShowSources(!showSources)}>
                <span>View Sources</span>
                <ItemIndicator>
                  <img src={IMAGE_LINKS['caret']} alt="Arrow" height={12} width={12} />
                </ItemIndicator>
              </ViewBreakupButton>
            </HeaderRight>
          </Header>
          <FeeDetails>
            {intent?.sources?.map((source) => (
              <Card key={source.chainID}>
                <FlexContainer>
                  <RelativeContainer>
                    <Logo src={intent?.token?.logo} alt="Token Logo" />
                    <ChainLogo src={source.chainLogo} alt="Chain Logo" />
                  </RelativeContainer>
                  <TokenDetails>
                    <TokenName>{source.chainName}</TokenName>
                  </TokenDetails>
                </FlexContainer>
                <AllowanceAmount>
                  {getReadableNumber(source.amount)} {intent?.token?.symbol}
                </AllowanceAmount>
              </Card>
            ))}
            {Number(
              balances
                .find((balance) => balance.symbol === intent?.token?.symbol)
                ?.breakdown.find((breakdown) => breakdown.chain.id === intent?.destination?.chainID)
                ?.balance
            ) > 0 && (
              <Card key={intent?.destination?.chainID}>
                <FlexContainer>
                  <RelativeContainer>
                    <Logo src={intent?.token?.logo} alt="Token Logo" />
                    <ChainLogo src={intent?.destination?.chainLogo} alt="Chain Logo" />
                  </RelativeContainer>
                  <TokenDetails>
                    <TokenName>{intent?.destination?.chainName}</TokenName>
                  </TokenDetails>
                </FlexContainer>
                <AllowanceAmount>
                  {getReadableNumber(
                    balances
                      .find((balance) => balance.symbol === intent?.token?.symbol)
                      ?.breakdown.find(
                        (breakdown) => breakdown.chain.id === intent?.destination?.chainID
                      )?.balance!
                  )}{' '}
                  {intent?.token?.symbol}
                </AllowanceAmount>
              </Card>
            )}
          </FeeDetails>
        </AccordionWrapper>

        <AccordionWrapper key="fees" value="fees">
          <Header>
            <HeaderLeft>
              <TooltipMessage>Total Fees</TooltipMessage>
              <AppTooltip message="Total Fees">
                <InfoImg src={IMAGE_LINKS['info']} alt="Info" height={18} width={18} />
              </AppTooltip>
            </HeaderLeft>
            <HeaderRight>
              <TotalFees>
                {getReadableNumber(intent?.fees?.total)} {intent?.token?.symbol}
              </TotalFees>
              {intent?.token?.symbol && rates?.[intent.token.symbol] && (
                <TotalAtDestination>
                  ~
                  {(Number(intent.fees.total || 0) / Number(rates[intent.token.symbol])).toFixed(2)}{' '}
                  USD
                </TotalAtDestination>
              )}
              <ViewBreakupButton
                onClick={() => {
                  setShowFees(!showFees), console.log('showFees', showFees);
                }}
              >
                <span>View Breakup</span>
                <ItemIndicator>
                  <img src={IMAGE_LINKS['caret']} alt="Arrow" height={12} width={12} />
                </ItemIndicator>
              </ViewBreakupButton>
            </HeaderRight>
          </Header>

          <FeeDetails>
            {[
              { label: 'CA Gas Fees', value: intent?.fees?.caGas, tooltip: 'Gas Fees' },
              { label: 'Solver Fees', value: intent?.fees?.solver, tooltip: 'Solver Fees' },
              { label: 'Protocol Fees', value: intent?.fees?.protocol, tooltip: 'Protocol Fees' },
              {
                label: 'Gas Supplied',
                value: intent?.fees?.gasSupplied,
                tooltip: 'Extra gas supplied',
              },
            ].map(({ label, value, tooltip }) => (
              <FeeRow key={label}>
                <HeaderLeft>
                  <Label>{label}:</Label>
                  <AppTooltip message={tooltip}>
                    <InfoImg src={IMAGE_LINKS['info']} alt="Info" height={14} width={14} />
                  </AppTooltip>
                </HeaderLeft>
                <HeaderRight>
                  <Value>
                    {getReadableNumber(value)} {intent?.token?.symbol}
                  </Value>
                </HeaderRight>
              </FeeRow>
            ))}
          </FeeDetails>
        </AccordionWrapper>
      </Root>

      <Header>
        <HeaderLeft>
          <TooltipMessage>Total</TooltipMessage>
          <AppTooltip message="Total Spend + Fees">
            <InfoImg src={IMAGE_LINKS['info']} alt="Info" height={18} width={18} />
          </AppTooltip>
        </HeaderLeft>
        <HeaderRight>
          <TotalFeesValue>
            {getReadableNumber(intent.sourcesTotal)} {intent?.token?.symbol}
          </TotalFeesValue>

          {rates?.[intent?.token?.symbol] && (
            <TotalAtDestinationValue>
              ~{(Number(intent?.sourcesTotal) / Number(rates[intent?.token?.symbol])).toFixed(2)}{' '}
              USD
            </TotalAtDestinationValue>
          )}
        </HeaderRight>
      </Header>

      <ButtonWrap>
        <Button onClick={() => deny()} variant="secondary">
          Cancel
        </Button>
        <Button onClick={() => allow()} disabled={intentRefreshing} variant="primary">
          {intentRefreshing ? 'Refreshing' : 'Confirm'}
        </Button>
      </ButtonWrap>
    </MainContainer>
  );
};

export default IntentView;
