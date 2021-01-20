const randomize = (value: number, maxChange: number): number => value + maxChange * 2 * (0.5 - Math.random());

export default randomize;
