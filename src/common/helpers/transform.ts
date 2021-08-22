import { SortOrder } from '@common/enums/sort-order.enum';

export const transformToArrayOfNumbers = (
  value: string,
  separator = ',',
): number[] =>
  String.prototype.split.call(value, separator).map((val) => Number(val));

export const transformToNumericRange = (
  value: string,
): Record<'equals' | 'min' | 'max', number | null> => {
  const splits = String.prototype.split.call(value, ':');

  if (splits.length === 1) {
    return {
      equals: Number(value),
      min: null,
      max: null,
    };
  } else if (splits.length === 2) {
    const found = value.match(/([^:]+)?:([^:]+)?/);

    if (Array.isArray(found) && found.length === 3) {
      const min = found[1] ? Number(found[1]) : null;
      const max = found[2] ? Number(found[2]) : null;

      return { equals: null, min, max };
    }
  }

  return {
    equals: null,
    min: null,
    max: null,
  };
};

export const transformToDateTimeRange = (
  value: string,
): Record<'start' | 'end', Date | null> => {
  const found = value.match(/([^..]+)?\.\.([^..]+)?/);

  if (Array.isArray(found) && found.length === 3) {
    const start = found[1] ? new Date(found[1]) : null;
    const end = found[2] ? new Date(found[2]) : null;

    return { start, end };
  }

  return { start: null, end: null };
};

export const transformToSorts = (
  value: string,
): Record<string, SortOrder | null> => {
  const sorts = {};
  const splits = String.prototype.split.call(value, ',');

  for (const sortStr of splits) {
    const found = sortStr.match(/([^:]+):([^:]+)/);

    if (Array.isArray(found) && found.length === 3) {
      const field = found[1];

      sorts[field] =
        found[2] === SortOrder.Desc ? SortOrder.Desc : SortOrder.Asc;
    }
  }

  return sorts;
};
