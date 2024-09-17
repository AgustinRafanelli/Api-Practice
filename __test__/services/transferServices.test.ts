import { UserModel } from "../../src/models/User";
import CURRENCIES from "../../src/constants/currencies";
const mockingoose = require("mockingoose");
import { handleTransfer, HTTPError } from "../../src/services/transferServices";

describe("handleTransfer function", () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  it("should throw a 404 error if the target user does not exist", async () => {
    mockingoose(UserModel).toReturn(null, "findOne");

    await expect(
      handleTransfer("nonexistentAlias", "alias", 0, 100, {})
    ).rejects.toThrow(
      new HTTPError("Target user do not belong to this bank", 404)
    );
  });

  it("should return a 400 error if the transaction amount is not greater than 0", async () => {
    mockingoose(UserModel).toReturn({ accounts: [{ amount: 50 }] }, "findOne");

    await expect(
      handleTransfer("someAlias", "alias", 0, -100, {})
    ).rejects.toThrow(
      new HTTPError("The transaction amount must be greater than 0", 400)
    );
  });

  it("should return a 400 error if there are insufficient funds", async () => {
    mockingoose(UserModel).toReturn({ accounts: [{ amount: 50 }] }, "findOne");

    const user = { accounts: [{ amount: 100 }], alias: "userAlias" };

    expect(handleTransfer("someAlias", "alias", 0, 200, user)).rejects.toThrow(
      new HTTPError("Insufficient funds", 400)
    );
  });

  it("should successfully transfer funds and update transactions", async () => {
    const user = { accounts: [{ amount: 100 }] , alias: "userAlias" };
    const targetUser = {
      accounts: [{ amount: 50 }],
      alias: "targetAlias",
    };

    mockingoose(UserModel)
      .toReturn(user, "findOne")
      .toReturn(targetUser, "findOne")
      .toReturn({ nModified: 1 }, "update")
      .toReturn({ nModified: 1 }, "update");

    const mockSession = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };
    jest.spyOn(UserModel, "startSession").mockResolvedValue(mockSession as any);

    const result = await handleTransfer("targetAlias", "alias", 0, 50, user);

    expect(result).toMatchObject({
      alias: "targetAlias",
      amount: -50,
      currency: CURRENCIES[0],
    });

    expect(mockSession.startTransaction).toHaveBeenCalled();
    expect(mockSession.commitTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
  });
});
