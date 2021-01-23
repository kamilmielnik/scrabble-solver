interface Cache<Key extends string, Value> {
  get(key: Key): Promise<Value | undefined>;
  has(key: Key): boolean;
  isStale(key: Key): boolean;
  set(key: Key, value: Value): Promise<void>;
}

export default Cache;
