declare module '*.module.scss' {
  const classesMap: Record<string, string>;
  export default classesMap;
}

declare module '*.scss' {
  const classesMap: Record<string, string>;
  export default classesMap;
}
