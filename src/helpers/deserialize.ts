import { RawData } from "ws";

export const deserialize = (data: RawData) => {
    return JSON.parse(String(data));
}