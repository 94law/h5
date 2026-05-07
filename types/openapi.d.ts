type DefineServiceParams<
  T extends Record<string, any>,
  P extends keyof T,
  M extends keyof T[P],
> = T[P][M] extends {
  requestBody: { content: { [contentType: string]: infer R } };
}
  ? R
  : T[P][M] extends { parameters: { query: infer R } }
    ? R
    : void;

type DefineServiceResult<
  T extends Record<string, any>,
  P extends keyof T,
  M extends keyof T[P],
> = T[P][M] extends {
  responses: { '200': { content: { [contentType: string]: { data?: infer R } } } };
}
  ? R
  : void;

type DefineService<
  T extends Record<string, any>,
  P extends keyof T,
  M extends keyof T[P] = 'post',
> = {
  Params: DefineServiceParams<T, P, M>;
  Result: DefineServiceResult<T, P, M>;
};
