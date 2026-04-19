import { execFileSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { TraceStep } from '../models/SubmissionTrace';

export class ExecutionTracer {
  private readonly MAX_STEPS = 100;
  private readonly TIMEOUT_MS = 5000;

  /**
   * Trace Python code execution and capture variable states
   */
  public async tracePythonExecution(sourceCode: string, input: string): Promise<TraceStep[]> {
    const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-trace-'));

    try {
      // Create the tracer wrapper
      const tracerCode = this.createPythonTracer(sourceCode);
      const codePath = path.join(workDir, 'traced_solution.py');
      fs.writeFileSync(codePath, tracerCode);

      // Execute with tracing
      const start = Date.now();
      const output = execFileSync('python3', [codePath], {
        input: input,
        timeout: this.TIMEOUT_MS,
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer for trace data
        encoding: 'utf-8',
        cwd: workDir,
      });

      // Parse the trace output
      const traces = this.parseTraceOutput(output);
      return traces.slice(0, this.MAX_STEPS); // Limit to 100 steps
    } catch (err: any) {
      console.error('Trace execution error:', err.message);
      return [];
    } finally {
      // Cleanup
      try {
        fs.rmSync(workDir, { recursive: true, force: true });
      } catch {}
    }
  }

  /**
   * Create Python tracer wrapper using sys.settrace
   */
  private createPythonTracer(userCode: string): string {
    return `
import sys
import json
import io
from contextlib import redirect_stdout

# ── User Code ──
${userCode}

# ── Tracer Implementation ──
trace_steps = []
step_count = 0
MAX_STEPS = ${this.MAX_STEPS}

def trace_calls(frame, event, arg):
    global step_count, trace_steps
    
    if step_count >= MAX_STEPS:
        return None
    
    # Only trace user code (not library code)
    if frame.f_code.co_filename != '<string>' and 'traced_solution.py' not in frame.f_code.co_filename:
        return None
    
    if event in ['line', 'call', 'return']:
        # Capture variable snapshots
        local_vars = {}
        for var_name, var_value in frame.f_locals.items():
            if not var_name.startswith('_'):
                try:
                    # Convert to JSON-serializable format
                    if isinstance(var_value, (int, float, str, bool, type(None))):
                        local_vars[var_name] = var_value
                    elif isinstance(var_value, (list, tuple)):
                        local_vars[var_name] = list(var_value)[:10]  # Limit array size
                    elif isinstance(var_value, dict):
                        local_vars[var_name] = {k: v for k, v in list(var_value.items())[:10]}
                    else:
                        local_vars[var_name] = str(type(var_value).__name__)
                except:
                    local_vars[var_name] = '<complex>'
        
        # Calculate call stack depth
        depth = 0
        f = frame
        while f is not None:
            depth += 1
            f = f.f_back
        
        trace_step = {
            'line_number': frame.f_lineno,
            'variable_snapshots': local_vars,
            'call_stack_depth': depth,
            'function_name': frame.f_code.co_name,
            'event': event
        }
        
        trace_steps.append(trace_step)
        step_count += 1
    
    return trace_calls

# ── Execute with tracing ──
try:
    # Read input
    input_lines = sys.stdin.read().strip().split('\\n')
    args = []
    for line in input_lines:
        line = line.strip()
        if not line:
            continue
        try:
            args.append(eval(line))
        except:
            args.append(line)
    
    # Create solution instance and trace execution
    sol = Solution()
    methods = [m for m in dir(sol) if not m.startswith('_') and callable(getattr(sol, m))]
    
    if methods:
        method = getattr(sol, methods[0])
        
        # Enable tracing
        sys.settrace(trace_calls)
        
        # Execute the method
        result = method(*args)
        
        # Disable tracing
        sys.settrace(None)
        
        # Output trace data as JSON
        print("__TRACE_START__")
        print(json.dumps(trace_steps))
        print("__TRACE_END__")
        
        # Output result
        print("__RESULT_START__")
        if isinstance(result, bool):
            print(str(result).lower())
        elif isinstance(result, list):
            print(json.dumps(result, separators=(',', ':')))
        elif result is None:
            print("null")
        else:
            print(result)
        print("__RESULT_END__")
    else:
        print("__ERROR__: No method found in Solution class")
        
except Exception as e:
    print(f"__ERROR__: {str(e)}")
    sys.exit(1)
`;
  }

  /**
   * Parse trace output from Python execution
   */
  private parseTraceOutput(output: string): TraceStep[] {
    try {
      const traceMatch = output.match(/__TRACE_START__([\s\S]*?)__TRACE_END__/);
      if (!traceMatch) {
        return [];
      }

      const traceJson = traceMatch[1].trim();
      const traces = JSON.parse(traceJson);

      // Filter and clean traces
      return traces
        .filter((step: any) => step.event === 'line') // Only keep line events
        .map((step: any) => ({
          line_number: step.line_number,
          variable_snapshots: step.variable_snapshots,
          call_stack_depth: step.call_stack_depth,
          function_name: step.function_name,
        }));
    } catch (err) {
      console.error('Failed to parse trace output:', err);
      return [];
    }
  }

  /**
   * Trace Java execution (simplified - would need more complex instrumentation)
   */
  public async traceJavaExecution(sourceCode: string, input: string): Promise<TraceStep[]> {
    // Java tracing would require bytecode instrumentation or debugging API
    // For now, return empty array - can be implemented with Java Debug Interface (JDI)
    console.log('Java tracing not yet implemented');
    return [];
  }

  /**
   * Get tracer for specific language
   */
  public async traceExecution(language: string, sourceCode: string, input: string): Promise<TraceStep[]> {
    switch (language.toLowerCase()) {
      case 'python':
        return await this.tracePythonExecution(sourceCode, input);
      case 'java':
        return await this.traceJavaExecution(sourceCode, input);
      default:
        return [];
    }
  }
}
