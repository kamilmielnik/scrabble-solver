interface Cache<Key extends string, Value> {
  get(key: Key): Promise<Value | undefined>;
  getLastModifiedTimestamp(key: Key): number | undefined;
  has(key: Key): boolean;
  isStale(key: Key): boolean | undefined;
  set(key: Key, value: Value): Promise<void>;
}

export default Cache;
