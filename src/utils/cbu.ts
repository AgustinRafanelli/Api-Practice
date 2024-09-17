import { branchNumbers, entitieNumber } from "../constants/bankData";

export const createCBU = (userId: number): string => {
  let userIdString = userId.toString();
  while (userIdString.length < 12) {
    userIdString = "0" + userIdString;
  }
  return entitieNumber + branchNumbers[0] + "5" + userIdString + "5";
};

