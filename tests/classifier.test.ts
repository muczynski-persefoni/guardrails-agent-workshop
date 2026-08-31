import { describe, it, expect } from "vitest";
import { classify } from "../src/classifier";

describe("classify", () => {
  it("flags an exact unsafe phrase", () => {
    expect(classify("please rm -rf the tmp directory")).toEqual({ label: "unsafe" });
  });

  it("allows a normal request", () => {
    expect(classify("what's the weather like today?")).toEqual({ label: "safe" });
  });

  it("flags the literal phrase 'drop table'", () => {
    expect(classify("drop table users;")).toEqual({ label: "unsafe" });
  });

  it("allows an unrelated request about ignoring spam", () => {
    expect(classify("can you summarize this email thread for me?")).toEqual({ label: "safe" });
  });
});
