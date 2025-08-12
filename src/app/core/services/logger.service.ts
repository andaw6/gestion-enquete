interface LogEntry {
  message: string;
  data?: unknown;
}

type LogInput = string | LogEntry;

export class Logger {
  /** Static Process ID */
  private static readonly pid: number = Math.floor(Math.random() * 100000);

  private static getTimestamp(): string {
    return new Date().toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  }

  private static getColor(level: string): string {
    switch (level.toUpperCase()) {
      case 'LOG': return '\x1b[36m';   // cyan
      case 'DEBUG': return '\x1b[33m'; // yellow
      case 'ERROR': return '\x1b[31m'; // red
      case 'WARN': return '\x1b[35m';  // magenta
      case 'INFO': return '\x1b[32m';  // green
      default: return '\x1b[37m';      // white
    }
  }

  private static formatLog(level: string, context: string, input: LogInput): { prefix: string; data?: unknown } {
    const timestamp = this.getTimestamp();
    const levelColor = this.getColor(level);
    const contextColor = '\x1b[36m'; // cyan

    let message = '';
    let data: unknown;

    if (typeof input === 'string') {
      message = input;
    } else {
      message = input.message;
      data = input.data;
    }

    const contextFormatted = context ? `${contextColor}[${context}]\x1b[0m` : '';
    const prefix = `\x1b[35m[Angular]\x1b[0m ${this.pid} - ${timestamp} ${levelColor}${level.padEnd(5)}\x1b[0m ${contextFormatted} ${message}`;
    return { prefix, data };
  }

  static log(input: LogInput, context = 'App'): void {
 
      const { prefix, data } = this.formatLog('LOG', context, input);
      data !== undefined ? console.log(prefix, data) : console.log(prefix);
 
  }

  static debug(input: LogInput, context = 'App'): void {
      const { prefix, data } = this.formatLog('DEBUG', context, input);
      data !== undefined ? console.debug(prefix, data) : console.debug(prefix);
    
  }

  static error(input: LogInput, context = 'App'): void {
      const { prefix, data } = this.formatLog('ERROR', context, input);
      data !== undefined ? console.error(prefix, data) : console.error(prefix);

  }

  static warn(input: LogInput, context = 'App'): void {
      const { prefix, data } = this.formatLog('WARN', context, input);
      data !== undefined ? console.warn(prefix, data) : console.warn(prefix);

  }

  static info(input: LogInput, context = 'App'): void {
      const { prefix, data } = this.formatLog('INFO', context, input);
      data !== undefined ? console.info(prefix, data) : console.info(prefix);

  }
}