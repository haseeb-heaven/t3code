import { assert, describe, it } from "@effect/vitest";

import * as WindowsChromiumSandbox from "./windowsChromiumSandbox.ts";

describe("windowsChromiumSandbox", () => {
  it("enables no-sandbox on Windows so the GPU process does not fatal startup", () => {
    assert.deepEqual(WindowsChromiumSandbox.resolveWindowsChromiumSandboxSwitches("win32"), [
      "no-sandbox",
    ]);
  });

  it("leaves Chromium sandbox switches alone on macOS and Linux", () => {
    assert.deepEqual(WindowsChromiumSandbox.resolveWindowsChromiumSandboxSwitches("darwin"), []);
    assert.deepEqual(WindowsChromiumSandbox.resolveWindowsChromiumSandboxSwitches("linux"), []);
  });

  it("applies resolved switches through the provided append callback", () => {
    const applied: string[] = [];

    const switches = WindowsChromiumSandbox.applyWindowsChromiumSandboxSwitches({
      platform: "win32",
      appendSwitch: (switchName) => {
        applied.push(switchName);
      },
    });

    assert.deepEqual(switches, ["no-sandbox"]);
    assert.deepEqual(applied, ["no-sandbox"]);
  });

  it("does not append switches on non-Windows platforms", () => {
    const applied: string[] = [];

    const switches = WindowsChromiumSandbox.applyWindowsChromiumSandboxSwitches({
      platform: "darwin",
      appendSwitch: (switchName) => {
        applied.push(switchName);
      },
    });

    assert.deepEqual(switches, []);
    assert.deepEqual(applied, []);
  });
});
