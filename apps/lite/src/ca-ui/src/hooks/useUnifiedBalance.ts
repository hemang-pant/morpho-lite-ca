import { useContext } from 'react';
import { CAUnifiedBalanceContext, CAContext } from '../context';
import Decimal from 'decimal.js';
import { useQuery } from '@tanstack/react-query';
import { ALLOWED_TOKENS } from '../utils/constants';

const UNIFIED_BALANCE_KEY = 'xar_unified_balance';
const BALANCE_REFETCH_INTERVAL = 30_000;

const useUnifiedBalance = () => {
  const { ca, ready } = useContext(CAContext);

  const { isPending, data } = useQuery({
    queryKey: [UNIFIED_BALANCE_KEY],
    queryFn: () => {
      if (ca && ready) {
        return ca.getUnifiedBalances();
      }
      return [];
    },
    refetchInterval: BALANCE_REFETCH_INTERVAL,
    enabled: ready && ca !== null,
  });
  let balance = BigInt(0);
  const ethBalance = data?.find((b) => b.symbol.toLowerCase() === 'eth');
  if (ethBalance) {
    balance = convertToDecimals(ethBalance.balance, 18);
  }

  const getAssetBalance = (asset: string) => {
    if (data?.length) {
      return data.find((b) => b.symbol.toLowerCase() === asset.toLowerCase());
    }
    return null;
  };
  return {
    balances: data ?? [],
    balance,
    loading: isPending,
    getAssetBalance,
  };
};

const useBalanceModal = () => {
  const { setVisible } = useContext(CAUnifiedBalanceContext);

  const showModal = () => {
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
  };

  return {
    showModal,
    hideModal,
  };
};

type UseBalanceParams = {
  symbol: ALLOWED_TOKENS;
};

export type UseBalanceReturnValue = {
  decimals: number;
  formatted: string;
  symbol: string;
  value: bigint;
  breakdown: {
    chain: {
      id: number;
      name: string;
      logo: string;
    };
    formatted: string;
    address: string;
    value: bigint;
  }[];
};

type UseBalanceReturn = {
  loading: boolean;
  data: UseBalanceReturnValue | null;
  error: Error | null;
};

const useBalance = ({ symbol }: UseBalanceParams): UseBalanceReturn => {
  const { ca, ready } = useContext(CAContext);

  const { isPending, data, isSuccess, error } = useQuery({
    queryKey: [UNIFIED_BALANCE_KEY],
    queryFn: () => {
      if (ca && ready) {
        return ca.getUnifiedBalances();
      }
      return [];
    },
    refetchInterval: BALANCE_REFETCH_INTERVAL,
    enabled: ready && ca !== null,
  });

  if (isSuccess) {
    const val = data.find((b) => b.symbol.toLowerCase() === symbol.toLowerCase());
    if (!val) {
      return {
        loading: false,
        data: null,
        error: new Error('asset not supported'),
      };
    }
    return {
      loading: false,
      data: {
        decimals: val.decimals,
        formatted: val.balance,
        symbol: val.symbol.toUpperCase(),
        value: convertToDecimals(val.balance, val.decimals),
        breakdown: val.breakdown.map((b) => {
          return {
            chain: b.chain,
            formatted: b.balance,
            address: b.contractAddress,
            value: convertToDecimals(b.balance, val.decimals),
          };
        }),
      },
      error: null,
    };
  } else {
    return {
      loading: isPending,
      error: error,
      data: null,
    };
  }
};

type UseBalancesReturn = {
  loading: boolean;
  data: UseBalanceReturnValue[] | null;
  error: Error | null;
};

const useBalances = (): UseBalancesReturn => {
  const { ca, ready } = useContext(CAContext);

  const { isPending, data, isSuccess, error } = useQuery({
    queryKey: [UNIFIED_BALANCE_KEY],
    queryFn: () => {
      if (ca && ready) {
        return ca.getUnifiedBalances();
      }
      return [];
    },
    refetchInterval: BALANCE_REFETCH_INTERVAL,
    enabled: ready && ca !== null,
  });

  if (isSuccess) {
    return {
      loading: false,
      data: data.map((v) => {
        return {
          decimals: v.decimals,
          formatted: v.balance,
          symbol: v.symbol.toUpperCase(),
          value: convertToDecimals(v.balance, v.decimals),
          breakdown: v.breakdown.map((b) => {
            return {
              chain: b.chain,
              formatted: b.balance,
              address: b.contractAddress,
              value: convertToDecimals(b.balance, v.decimals),
            };
          }),
        };
      }),
      error: null,
    };
  } else {
    return {
      loading: isPending,
      error: error,
      data: null,
    };
  }
};

const convertToDecimals = (value: string, decimals: number) => {
  return BigInt(new Decimal(value).mul(Decimal.pow(10, decimals)).toString());
};

export { useUnifiedBalance, useBalanceModal, useBalance, useBalances };
