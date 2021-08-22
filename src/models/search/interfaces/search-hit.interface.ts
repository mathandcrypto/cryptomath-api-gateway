export interface SearchHit<T> {
  index: string;
  id: string;
  score: number;
  data: T;
}
