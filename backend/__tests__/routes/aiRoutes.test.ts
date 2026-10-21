import request from "supertest";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { createAccessToken } from "./noteRoutes.test";
import app from "../../src/app";
import User from "../../src/models/UserModel";
import { generate } from "../../src/service/geminiService";

vi.mock("../../src/service/geminiService", () => ({
  generate: vi.fn(),
}));

describe("ai route", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    vi.mocked(generate).mockReset();
  });

  it("will post /generate successfully", async () => {
    vi.mocked(generate).mockResolvedValue("High priority");

    const { accessToken } = await createAccessToken("Employee");

    const res = await request(app)
      .post("/api/ai/generate")
      .set("Cookie", [`accessToken=${accessToken}`])
      .send({
        action: "priority",
        description: "Create authentication system",
        noteId: "",
      });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      answer: "High priority",
    });

    expect(generate).toHaveBeenCalledWith({
      action: "priority",
      content: "Create authentication system",
    });
  });
});