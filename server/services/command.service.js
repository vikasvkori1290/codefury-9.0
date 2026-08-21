import { spawn } from "child_process";

export const runCommand = (command, args = [], { timeoutMs = 30000, maxOutputBytes = 1024 * 1024 } = {}) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, { shell: false, windowsHide: true });
    let stdout = "";
    let stderr = "";
    let settled = false;

    const finish = (fn, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      fn(value);
    };
    const append = (current, chunk) => `${current}${chunk.toString()}`.slice(-maxOutputBytes);
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      finish(reject, new Error(`Command timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    child.stdout?.on("data", (chunk) => { stdout = append(stdout, chunk); });
    child.stderr?.on("data", (chunk) => { stderr = append(stderr, chunk); });
    child.once("error", (error) => finish(reject, error));
    child.once("close", (code, signal) => {
      if (code === 0) return finish(resolve, { stdout, stderr, code, signal });
      finish(reject, new Error(stderr.trim() || `Command exited with code ${code}`));
    });
  });

export default runCommand;
