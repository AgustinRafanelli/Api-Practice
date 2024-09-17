const mockingoose = require("mockingoose");
import bcrypt from "bcrypt";
import { UserModel } from "../../src/models/User"
import Counter from "../../src/models/Counter";
import * as utilsCBU from "../../src/utils/cbu";

describe("User Model Test", () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  it("should hash the password and generate clientId and CBU on save", async () => {
    const mockCounter = { _id: "clientId", sequenceValue: 1 };

    mockingoose(Counter).toReturn(mockCounter, "findOneAndUpdate");

    const mockUser = {
      name: "John",
      surname: "Doe",
      dni: "12345678",
      password: "plaintextpassword",
      alias: "john_doe",
      pin: 1234,
      accounts: [],
      transactions: [],
    };

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(mockUser.password, salt);
    jest.spyOn(bcrypt, "genSalt").mockResolvedValue(salt);
    jest.spyOn(bcrypt, "hash").mockResolvedValue(hashedPassword);
    
    const user = new UserModel(mockUser);
    await user.save();
    const cbu = "111000150000000000015";
    jest.spyOn(utilsCBU, "createCBU").mockReturnValue(cbu);

    expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    expect(bcrypt.hash).toHaveBeenCalledWith(mockUser.password, salt);
    expect(user.password).toBe(hashedPassword);
    expect(user.clientId).toBe(mockCounter.sequenceValue); 
    expect(user.cbu).toBe(cbu);
  });

  it("should correctly compare the password using comparePassword method", async () => {
    const mockUser = {
      _id: "mockId",
      password: await bcrypt.hash("plaintextpassword", 10),
    };

    mockingoose(UserModel).toReturn(mockUser, "findOne");

    const user = await UserModel.findOne({ _id: "mockId" });
    const isMatch = await user?.comparePassword("plaintextpassword");

    expect(isMatch).toBe(true);
  });
});
