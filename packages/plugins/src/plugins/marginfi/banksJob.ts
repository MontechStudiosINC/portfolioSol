import {
  BorrowLendRate,
  NetworkId,
  aprToApy,
  borrowLendRatesPrefix,
} from '@sonarwatch/portfolio-core';
import { MarginfiProgram, platformId, prefix } from './constants';
import { bankStruct } from './structs/Bank';
import { banksFilters } from './filters';
import { getInterestRates, wrappedI80F48toBigNumber } from './helpers';
import { getParsedProgramAccounts } from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();

  const banksRawData = await getParsedProgramAccounts(
    connection,
    bankStruct,
    MarginfiProgram,
    banksFilters()
  );

  for (let index = 0; index < banksRawData.length; index += 1) {
    const bank = banksRawData[index];
    await cache.setItem(
      bank.pubkey.toString(),
      {
        ...bank,
        dividedAssetShareValue: wrappedI80F48toBigNumber(
          bank.assetShareValue
        ).div(10 ** bank.mintDecimals),
        dividedLiabilityShareValue: wrappedI80F48toBigNumber(
          bank.liabilityShareValue
        ).div(10 ** bank.mintDecimals),
      },
      {
        prefix,
        networkId: NetworkId.solana,
      }
    );

    const { lendingApr, borrowingApr } = getInterestRates(bank);
    const depositedAmount = wrappedI80F48toBigNumber(bank.liabilityShareValue)
      .times(wrappedI80F48toBigNumber(bank.totalLiabilityShares))
      .toNumber();

    const borrowedAmount = wrappedI80F48toBigNumber(bank.assetShareValue)
      .times(wrappedI80F48toBigNumber(bank.totalAssetShares))
      .toNumber();

    if (borrowedAmount <= 10 && depositedAmount <= 10) continue;

    const tokenAddress = bank.mint.toString();

    const poolName =
      bank.config.riskTier === 0 ? 'Global Pool' : 'Isolated Pool';

    const rate: BorrowLendRate = {
      tokenAddress,
      borrowYield: {
        apy: aprToApy(borrowingApr),
        apr: borrowingApr,
      },
      borrowedAmount,
      depositYield: {
        apy: aprToApy(lendingApr),
        apr: lendingApr,
      },
      depositedAmount,
      platformId,
      poolName,
    };

    await cache.setItem(`${bank.pubkey.toString()}-${tokenAddress}`, rate, {
      prefix: borrowLendRatesPrefix,
      networkId: NetworkId.solana,
    });
  }
};

const job: Job = {
  id: `${platformId}-banks`,
  executor,
  label: 'normal',
};
export default job;
