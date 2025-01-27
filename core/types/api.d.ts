export interface ApiReturn<T = any, E = any> {
  data: T;
  status: number;
  message: string;
  error?: E | null;
}