import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { pinAuth } from "../../src/middleware/transfer";
import PINLIMIT from "../../src/constants/pinLimit";
import CURRENCIES from "../../src/constants/currencies";

jest.mock("express-validator", () => ({
  body: jest.fn(() => jest.fn()),
  validationResult: jest.fn(),
}));

interface MokedRequest extends Request {
  clientId: number;
  user?: { pin?: number };
}

describe("pinAuth Middleware", () => {
  let req: Partial<MokedRequest>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      body: { currencyId: "0", amount: "500", pin: "1234" },
      user: { pin: 1234 },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call next if no validation errors and no pin required", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValueOnce({
      isEmpty: () => true,
    });

    await pinAuth[2](req as any, res as any, next);

    expect(next).toHaveBeenCalled();
  });

  it("should return 400 if validation errors exist", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValueOnce({
      isEmpty: () => false,
      array: () => [{ msg: "Invalid currencyId" }],
    });

    await pinAuth[1](req as any, res as any, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: [{ msg: "Invalid currencyId" }],
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if pin is not provided for high transactions", async () => {
    req.body.amount = PINLIMIT[0] + 100;
    req.body.pin = undefined;

    (validationResult as unknown as jest.Mock).mockReturnValueOnce({
      isEmpty: () => true,
    });

    await pinAuth[2](req as any, res as any, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: `Unauthorized, pin needs to be provided for transactions highter than ${
        CURRENCIES[0].identifier + " " + PINLIMIT[0]
      }`,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if pin is incorrect", async () => {
    req.body.amount = PINLIMIT[0] + 100;
    req.body.pin = "9999";

    (validationResult as unknown as jest.Mock).mockReturnValueOnce({
      isEmpty: () => true,
    });

    await pinAuth[2](req as any, res as any, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Unauthorized, wrong pin",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should pass if pin is correct and amount exceeds limit", async () => {
    req.body.amount = PINLIMIT[0] + 100;
    req.body.pin = "1234";

    (validationResult as unknown as jest.Mock).mockReturnValueOnce({
      isEmpty: () => true,
    });

    await pinAuth[2](req as any, res as any, next);

    expect(next).toHaveBeenCalled();
  });

  it("should handle server error", async () => {
    (validationResult as unknown as jest.Mock).mockImplementationOnce(() => {
      throw new Error("Internal Server Error");
    });

    await pinAuth[2](req as any, res as any, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal Server Error" });
  });
});
