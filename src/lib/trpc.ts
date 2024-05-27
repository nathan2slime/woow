import type { AppRouter } from '~/server/api/root';

export type TRoute = AppRouter['_def']['procedures'];

export type InferOutput<
  TRouteKey extends keyof TRoute,
  TQueryKey extends keyof TRoute[TRouteKey],
> = NonNullable<TRoute[TRouteKey][TQueryKey]['_def']['$types']['output']>;
export type InferInput<
  TRouteKey extends keyof TRoute,
  TQueryKey extends keyof TRoute[TRouteKey],
> = TRoute[TRouteKey][TQueryKey]['_def']['$types']['input'];
