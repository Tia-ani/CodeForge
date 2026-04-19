import { execFileSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { Submission, TestCase } from '../models';

// ── Evaluation Result ──────────────────────────────────────────
export interface EvaluationResult {
  verdict: string;
  runtime: number;
  failedTestCase?: number;
  totalTestCases: number;
  passedTestCases: number;
  failedInput?: string;
  expectedOutput?: string;
  actualOutput?: string;
}

// ── Strategy Pattern Interface ─────────────────────────────────
export interface LanguageExecutor {
  execute(sourceCode: string, testCases: TestCase[]): Promise<EvaluationResult>;
}

// ── Utility: create a secure temp directory ────────────────────
function createTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'codeforge-'));
}

function cleanupDir(dir: string) {
  try {
    fs.rmSync(dir, { recursive: true, force: true });
  } catch { /* silent */ }
}

// ── Base Executor (Template Method Pattern) ────────────────────
// Iterates through test cases one-by-one. Concrete strategies
// only need to implement `runSingle()`.
abstract class BaseExecutor implements LanguageExecutor {
  protected readonly TIMEOUT_MS = 5000;

  /**
   * Run the code against a single test-case input.
   * Returns { stdout, runtime } on success, or throws on error.
   */
  protected abstract runSingle(
    sourceCode: string,
    input: string,
    workDir: string,
  ): { stdout: string; runtime: number };

  /**
   * Optional compile step (Java, C++). Throws on compile error.
   */
  protected compile(_sourceCode: string, _workDir: string): void {
    // no-op by default — Python doesn't compile
  }

  async execute(sourceCode: string, testCases: TestCase[]): Promise<EvaluationResult> {
    const totalTestCases = testCases.length;
    let passedTestCases = 0;
    const workDir = createTempDir();

    try {
      // Compile once (no-op for interpreted languages)
      try {
        this.compile(sourceCode, workDir);
      } catch (err: any) {
        return {
          verdict: 'COMPILATION_ERROR',
          runtime: 0,
          failedTestCase: 1,
          totalTestCases,
          passedTestCases: 0,
          actualOutput: err.message?.substring(0, 500),
        };
      }

      const globalStart = Date.now();

      // Iterate every test case — return WRONG_ANSWER on first mismatch
      for (let i = 0; i < testCases.length; i++) {
        const tc = testCases[i];

        try {
          const { stdout, runtime } = this.runSingle(sourceCode, tc.input, workDir);

          const actual = this.normalizeOutput(stdout);
          
          // If expectedOutput is empty, this is a custom run (just return output)
          if (!tc.expectedOutput || tc.expectedOutput.trim() === '') {
            return {
              verdict: 'EXECUTED',
              runtime: Date.now() - globalStart,
              totalTestCases,
              passedTestCases: 1,
              actualOutput: actual,
            };
          }
          
          const expected = this.normalizeOutput(tc.expectedOutput);

          if (actual !== expected) {
            return {
              verdict: 'WRONG_ANSWER',
              runtime: Date.now() - globalStart,
              failedTestCase: i + 1,
              totalTestCases,
              passedTestCases,
              failedInput: tc.input,
              expectedOutput: expected,
              actualOutput: actual,
            };
          }

          passedTestCases++;
        } catch (err: any) {
          const msg: string = err.message || '';

          if (msg.includes('TIMEDOUT') || msg.includes('TIMEOUT')) {
            return {
              verdict: 'TIME_LIMIT_EXCEEDED',
              runtime: this.TIMEOUT_MS,
              failedTestCase: i + 1,
              totalTestCases,
              passedTestCases,
              failedInput: tc.input,
              expectedOutput: tc.expectedOutput,
            };
          }

          return {
            verdict: 'RUNTIME_ERROR',
            runtime: Date.now() - globalStart,
            failedTestCase: i + 1,
            totalTestCases,
            passedTestCases,
            failedInput: tc.input,
            expectedOutput: tc.expectedOutput,
            actualOutput: msg.substring(0, 500),
          };
        }
      }

      // All test cases passed
      return {
        verdict: 'ACCEPTED',
        runtime: Date.now() - globalStart,
        totalTestCases,
        passedTestCases,
      };
    } finally {
      cleanupDir(workDir);
    }
  }

  /**
   * Normalize whitespace and trailing newlines for comparison.
   */
  protected normalizeOutput(raw: string): string {
    return raw
      .trim()
      .replace(/\r\n/g, '\n')
      .replace(/\s+$/gm, '');
  }
}

// ── Python Executor (Strategy) ─────────────────────────────────
export class PythonExecutor extends BaseExecutor {
  protected runSingle(sourceCode: string, input: string, workDir: string) {
    // Build a wrapper that runs the user's Solution class
    const driver = `
import sys, json, inspect

# ── User code ──
${sourceCode}

# ── Auto-driver ──
sol = Solution()
_methods = [m for m in dir(sol) if not m.startswith('_') and callable(getattr(sol, m))]
if not _methods:
    print("NO_METHOD_FOUND")
    sys.exit(0)

_method = getattr(sol, _methods[0])

_raw = sys.stdin.read().strip()
_lines = _raw.split('\\n') if _raw else []

# Parse each input line as a Python literal
_args = []
for _l in _lines:
    _l = _l.strip()
    if not _l:
        continue
    try:
        _args.append(eval(_l))
    except:
        _args.append(_l)

_result = _method(*_args)
if isinstance(_result, bool):
    print(str(_result).lower())
elif isinstance(_result, list):
    print(json.dumps(_result, separators=(',', ':')))
elif _result is None:
    print("null")
else:
    print(_result)
`;

    const codePath = path.join(workDir, 'solution.py');
    fs.writeFileSync(codePath, driver);

    const start = Date.now();
    try {
      const stdout = execFileSync('python3', [codePath], {
        input: input,
        timeout: this.TIMEOUT_MS,
        maxBuffer: 1024 * 1024,
        encoding: 'utf-8',
        cwd: workDir,
      });
      return { stdout: stdout.toString(), runtime: Date.now() - start };
    } catch (err: any) {
      if (err.killed || err.signal === 'SIGTERM') {
        throw new Error('TIMEDOUT');
      }
      throw new Error(err.stderr?.toString()?.substring(0, 500) || err.message);
    }
  }
}

// ── Java Executor (Strategy) ───────────────────────────────────
export class JavaExecutor extends BaseExecutor {
  protected compile(sourceCode: string, workDir: string): void {
    // Wrap user code with a main method driver
    const driver = `
import java.util.*;
import java.io.*;

${sourceCode}

class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = br.readLine()) != null) {
            sb.append(line).append("\\n");
        }
        String input = sb.toString().trim();
        
        // Try to instantiate Solution and call methods via reflection
        try {
            Solution sol = new Solution();
            java.lang.reflect.Method[] methods = Solution.class.getDeclaredMethods();
            java.lang.reflect.Method target = null;
            for (java.lang.reflect.Method m : methods) {
                if (!m.getName().equals("main")) {
                    target = m;
                    break;
                }
            }
            if (target == null) {
                System.out.println("NO_METHOD");
                return;
            }
            
            String[] lines = input.split("\\\\n");
            Class<?>[] paramTypes = target.getParameterTypes();
            Object[] params = new Object[paramTypes.length];
            
            for (int i = 0; i < paramTypes.length && i < lines.length; i++) {
                String val = lines[i].trim();
                if (paramTypes[i] == int.class || paramTypes[i] == Integer.class) {
                    params[i] = Integer.parseInt(val);
                } else if (paramTypes[i] == String.class) {
                    params[i] = val;
                } else if (paramTypes[i] == int[].class) {
                    val = val.replaceAll("[\\\\[\\\\]\\\\s]", "");
                    String[] parts = val.split(",");
                    int[] arr = new int[parts.length];
                    for (int j = 0; j < parts.length; j++) arr[j] = Integer.parseInt(parts[j].trim());
                    params[i] = arr;
                } else {
                    params[i] = val;
                }
            }
            
            Object result = target.invoke(sol, params);
            if (result instanceof int[]) {
                System.out.println(Arrays.toString((int[]) result));
            } else if (result instanceof boolean) {
                System.out.println(((boolean) result) ? "true" : "false");
            } else {
                System.out.println(result);
            }
        } catch (Exception e) {
            System.err.println(e.getMessage());
            System.exit(1);
        }
    }
}
`;

    const mainPath = path.join(workDir, 'Main.java');
    // Also write Solution.java if the source has a Solution class
    const solPath = path.join(workDir, 'Solution.java');

    // Extract Solution class and write separately
    fs.writeFileSync(solPath, sourceCode);
    fs.writeFileSync(mainPath, driver);

    try {
      execFileSync('javac', [solPath, mainPath], {
        timeout: 15000,
        cwd: workDir,
        encoding: 'utf-8',
      });
    } catch (err: any) {
      throw new Error('COMPILATION_ERROR: ' + (err.stderr?.toString()?.substring(0, 500) || err.message));
    }
  }

  protected runSingle(_sourceCode: string, input: string, workDir: string) {
    const start = Date.now();
    try {
      const stdout = execFileSync('java', ['-cp', workDir, 'Main'], {
        input: input,
        timeout: this.TIMEOUT_MS,
        maxBuffer: 1024 * 1024,
        encoding: 'utf-8',
        cwd: workDir,
      });
      return { stdout: stdout.toString(), runtime: Date.now() - start };
    } catch (err: any) {
      if (err.killed || err.signal === 'SIGTERM') {
        throw new Error('TIMEDOUT');
      }
      throw new Error(err.stderr?.toString()?.substring(0, 500) || err.message);
    }
  }
}

// ── C++ Executor (Strategy) ────────────────────────────────────
export class CppExecutor extends BaseExecutor {
  protected compile(sourceCode: string, workDir: string) {
    // Wrap the user's code with a main() driver
    const driver = `
#include <iostream>
#include <sstream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

${sourceCode}

int main() {
    // Generic: read all input, try to call Solution methods
    string line;
    vector<string> lines;
    while (getline(cin, line)) {
        lines.push_back(line);
    }
    
    Solution sol;
    // This is a simplified driver; real OJ would generate per-problem
    cout << "OK" << endl;
    return 0;
}
`;

    const srcPath = path.join(workDir, 'solution.cpp');
    const binPath = path.join(workDir, 'solution');
    fs.writeFileSync(srcPath, driver);

    try {
      execFileSync('g++', ['-std=c++17', '-O2', '-o', binPath, srcPath], {
        timeout: 15000,
        cwd: workDir,
        encoding: 'utf-8',
      });
    } catch (err: any) {
      // Try clang++ as fallback (macOS)
      try {
        execFileSync('clang++', ['-std=c++17', '-O2', '-o', binPath, srcPath], {
          timeout: 15000,
          cwd: workDir,
          encoding: 'utf-8',
        });
      } catch (err2: any) {
        throw new Error('COMPILATION_ERROR: ' + (err.stderr?.toString()?.substring(0, 500) || err.message));
      }
    }
  }

  protected runSingle(_sourceCode: string, input: string, workDir: string) {
    const binPath = path.join(workDir, 'solution');
    const start = Date.now();
    try {
      const stdout = execFileSync(binPath, [], {
        input: input,
        timeout: this.TIMEOUT_MS,
        maxBuffer: 1024 * 1024,
        encoding: 'utf-8',
        cwd: workDir,
      });
      return { stdout: stdout.toString(), runtime: Date.now() - start };
    } catch (err: any) {
      if (err.killed || err.signal === 'SIGTERM') {
        throw new Error('TIMEDOUT');
      }
      throw new Error(err.stderr?.toString()?.substring(0, 500) || err.message);
    }
  }
}

// ── Factory Pattern ────────────────────────────────────────────
export class ExecutorFactory {
  private static executors: Map<string, LanguageExecutor> = new Map();

  static getExecutor(language: string): LanguageExecutor {
    const key = language.toLowerCase();

    // Cache executor instances
    if (!this.executors.has(key)) {
      switch (key) {
        case 'java':
          this.executors.set(key, new JavaExecutor());
          break;
        case 'python':
          this.executors.set(key, new PythonExecutor());
          break;
        case 'cpp':
          this.executors.set(key, new CppExecutor());
          break;
        default:
          throw new Error(`Unsupported language: ${language}`);
      }
    }

    return this.executors.get(key)!;
  }
}

// ── Singleton Pattern — JudgeEngine ────────────────────────────
export class JudgeEngine {
  private static instance: JudgeEngine;

  private constructor() {}

  public static getInstance(): JudgeEngine {
    if (!JudgeEngine.instance) {
      JudgeEngine.instance = new JudgeEngine();
    }
    return JudgeEngine.instance;
  }

  /**
   * Evaluate a submission against its test cases.
   * Delegates to the appropriate LanguageExecutor via Factory + Strategy.
   */
  public async evaluateSubmission(
    submission: Submission,
    testCases: TestCase[],
  ): Promise<EvaluationResult> {
    const executor = ExecutorFactory.getExecutor(submission.language);
    return await executor.execute(submission.code, testCases);
  }
}
