import { RawData } from "ws";

export const deserialize = <T>(data: RawData): T => {
    return JSON.parse(String(data));
}