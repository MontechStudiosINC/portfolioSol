export type Lock = StandardLock | UnbondingLock;

export type StandardLock = {
  type: 'standard';
  data: {
    endTs: number;
  };
};

export type UnbondingLock = {
  type: 'unboding';
  data: {
    periodMs: number;
    startedTs?: number;
    endTs?: number;
  };
};

export const createUnbondingLock = (
  periodMs: number,
  startedTs?: number
): UnbondingLock => ({
  type: 'unboding',
  data: {
    periodMs,
    startedTs: startedTs || undefined,
    endTs: startedTs ? startedTs + periodMs : undefined,
  },
});

export const createStandardLock = (endTs: number): StandardLock => ({
  type: 'standard',
  data: {
    endTs,
  },
});
