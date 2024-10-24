import { RegData } from "../types/data";

export const printData = <T>(msg: T): void => {
  const { type, data, id } = msg as RegData;
  console.log(`From log fn: ${type}: ${data}`);
};
