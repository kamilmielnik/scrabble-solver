export interface WiktionaryResponse {
  batchcomplete: string;
  warnings: {
    extracts: {
      '*': string;
    };
  };
  query: {
    pages: Record<
      string,
      {
        pageid: number;
        ns: number;
        title: string;
        extract: string;
      }
    >;
  };
}
