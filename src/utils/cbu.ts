import { branchesNumber, entitieNumber } from "../constants/bankData";

const createCBU = (userId: number): string => {
  let userIdString = userId.toString();
  while (userIdString.length < 12) {
    userIdString = "0" + userIdString;
  }
  return entitieNumber + branchesNumber[0] + "5" + userIdString + "5";
};

export { createCBU }
