/**
 * Windows Chromium/Electron can fatal the whole desktop process with
 * `GPU process isn't usable. Goodbye.` / exit_code=-2147483645
 * (STATUS_BREAKPOINT) when the GPU sandbox is enabled. Affected machines
 * never show a window; Task Manager only shows background helpers.
 *
 * Empirically on Windows:
 * - no flags / `--disable-gpu-sandbox` / `--in-process-gpu`: no usable window
 * - `--no-sandbox`: process stays alive and the main window shows
 *
 * See https://github.com/pingdotgg/t3code/issues/1357 and #4543.
 * Linux already opts into `--no-sandbox` from the desktop launcher when
 * chrome-sandbox is not setuid; this is the packaged-Windows equivalent.
 */
export type WindowsChromiumSandboxSwitch = "no-sandbox";

export function resolveWindowsChromiumSandboxSwitches(
  platform: NodeJS.Platform,
): ReadonlyArray<WindowsChromiumSandboxSwitch> {
  return platform === "win32" ? ["no-sandbox"] : [];
}

export function applyWindowsChromiumSandboxSwitches(input: {
  readonly platform: NodeJS.Platform;
  readonly appendSwitch: (switchName: WindowsChromiumSandboxSwitch) => void;
}): ReadonlyArray<WindowsChromiumSandboxSwitch> {
  const switches = resolveWindowsChromiumSandboxSwitches(input.platform);
  for (const switchName of switches) {
    input.appendSwitch(switchName);
  }
  return switches;
}
