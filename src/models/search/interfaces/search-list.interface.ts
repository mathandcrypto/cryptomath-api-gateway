import { BaseList } from '@common/interfaces/response/base-list.interface';

export interface SearchList extends BaseList {
  took: number;
}
