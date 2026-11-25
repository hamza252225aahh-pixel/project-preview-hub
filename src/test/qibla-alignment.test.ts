import { describe, expect, it } from "vitest";
import { getQiblaAlignment } from "@/quran/lib/qibla-alignment";

describe("Qibla alignment indicator", () => {
  it("matches the Qibla with an easy ten-degree tolerance", () => {
    expect(getQiblaAlignment(100, 100)).toBe("aligned");
    expect(getQiblaAlignment(100, 110)).toBe("aligned");
    expect(getQiblaAlignment(100, 89)).toBe("misaligned");
  });
  it("compares the shortest angle across north and multiple turns", () => {
    expect(getQiblaAlignment(359, 1)).toBe("aligned");
    expect(getQiblaAlignment(1, -359)).toBe("aligned");
    expect(getQiblaAlignment(0, 1085)).toBe("aligned");
    expect(getQiblaAlignment(0, 180)).toBe("misaligned");
  });
  it("keeps green stable until the fourteen-degree release margin", () => {
    expect(getQiblaAlignment(100, 112, "aligned")).toBe("aligned");
    expect(getQiblaAlignment(100, 114, "aligned")).toBe("aligned");
    expect(getQiblaAlignment(100, 115, "aligned")).toBe("misaligned");
    expect(getQiblaAlignment(100, 112, "misaligned")).toBe("misaligned");
  });
  it("never reports alignment without valid location and compass readings", () => {
    expect(getQiblaAlignment(null, 0)).toBe("waiting");
    expect(getQiblaAlignment(0, null, "aligned")).toBe("waiting");
    expect(getQiblaAlignment(0, NaN)).toBe("waiting");
    expect(getQiblaAlignment(Infinity, 0)).toBe("waiting");
  });
});