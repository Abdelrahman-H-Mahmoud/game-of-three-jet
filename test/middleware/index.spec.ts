import { config } from "../../src/config"
import { validatePlayerMove, validatePlayerEmail } from "../../src/middleware";

describe("middlewares", () => {
  const req: any = {
    body: {}
  }
  const res: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  }
  const next = jest.fn();

  beforeEach(() => {
    req.body = {};
  })
  describe("validatePlayerMove", () => {
    it.each(config.allowedNumber)("should call next for valid numbers", (number) => {
      req.body.number = number;
      validatePlayerMove(req, res, next);
      expect(next).toBeCalled();
    })

    it("should return 400 for invalid numbers", () => {
      req.body.number = 5;
      validatePlayerMove(req, res, next);
      expect(res.status).toBeCalled();
      expect(res.status).toBeCalledWith(400);
      expect(res.json).toBeCalled();
    })
    it("should return 400 if number not provided", () => {
      req.body = {};
      validatePlayerMove(req, res, next);
      expect(res.status).toBeCalled();
      expect(res.status).toBeCalledWith(400);
      expect(res.json).toBeCalled();
    })
  })

  describe("validatePlayerEmail", () => {
    it.each([
      "simple@example.com",
      "very.common@example.com",
      "abc@example.co.uk",
      "disposable.style.email.with+symbol@example.com",
      "other.email-with-hyphen@example.com",
      "fully-qualified-domain@example.com",
      "user.name+tag+sorting@example.com",
      "example-indeed@strange-example.com"
    ])("should call next for valid emails", (email) => {
      req.body.email = email;
      validatePlayerEmail(req, res, next);
      expect(next).toBeCalled();
    })

    it("should return 400 for invalid email", () => {
      req.body.email = "ab";
      validatePlayerEmail(req, res, next);
      expect(res.status).toBeCalled();
      expect(res.status).toBeCalledWith(400);
      expect(res.json).toBeCalled();
    })
    it("should return 400 if email not provided", () => {
      req.body = {};
      validatePlayerEmail(req, res, next);
      expect(res.status).toBeCalled();
      expect(res.status).toBeCalledWith(400);
      expect(res.json).toBeCalled();
    })
  })
})