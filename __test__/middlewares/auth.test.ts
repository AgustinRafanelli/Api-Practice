import {
  authenticateToken,
  AuthenticatedRequest,
  authenticatePassword,
} from "../../src/middleware/auth";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { UserModel } from "../../src/models/User";
import * as expres from "express-validator";

describe("authenticateToken middleware", () => {
  const mockNext: NextFunction = jest.fn();

  it("should return 401 if no token is provided", () => {
    const req = {
      header: jest.fn().mockReturnValue(null),
    } as unknown as AuthenticatedRequest;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    authenticateToken(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Access denied. No token provided.",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 400 if token is invalid", () => {
    const req = {
      header: jest.fn().mockReturnValue("Bearer invalidToken"),
    } as unknown as AuthenticatedRequest;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    jest.spyOn(jwt, "verify").mockImplementation(() => {
      throw new Error("Invalid token");
    });

    authenticateToken(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid token" });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should call next if token is valid", () => {
    const req = {
      header: jest.fn().mockReturnValue("Bearer validToken"),
    } as unknown as AuthenticatedRequest;
    const res = {} as unknown as Response;

    const mockDecodedToken = { clientId: 123 };
    jest.spyOn(jwt, "verify").mockReturnValue(mockDecodedToken);

    authenticateToken(req, res, mockNext);

    expect(req.clientId).toBe(123);
    expect(mockNext).toHaveBeenCalled();
  });
});

describe("authenticatePassword middleware", () => {
  const mockNext: NextFunction = jest.fn();
  const mockUser = { comparePassword: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if password is incorrect", async () => {
    const req = {
      body: { password: "incorrectpassword" },
      user: { clientId: 123 },
    } as AuthenticatedRequest;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    jest.spyOn(UserModel, "findOne").mockResolvedValue(mockUser);
    mockUser.comparePassword.mockResolvedValue(false);

    await authenticatePassword[1](req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should call next if password is correct", async () => {
    const req = {
      body: { password: "correctpassword" },
      user: { clientId: 123 },
    } as AuthenticatedRequest;
    const res = {} as unknown as Response;

    jest.spyOn(UserModel, "findOne").mockResolvedValue(mockUser);
    mockUser.comparePassword.mockResolvedValue(true);
    await authenticatePassword[1](req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });
});
