export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4
}

export class Logger {
  private static instance: Logger;
  private logLevel: LogLevel;

  private constructor() {
    this.logLevel = LogLevel.INFO;
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  private formatMessage(level: string, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${level}] ${message}`;
    
    if (data) {
      return `${formattedMessage} ${JSON.stringify(data, null, 2)}`;
    }
    
    return formattedMessage;
  }

  private writeToFile(message: string): void {
    const fs = require('fs');
    const path = require('path');
    const logDir = 'logs';
    const logFile = path.join(logDir, `test-${new Date().toISOString().split('T')[0]}.log`);
    
    // Create logs directory if it doesn't exist
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    // Append message to log file
    fs.appendFileSync(logFile, message + '\n');
  }

  debug(message: string, data?: any): void {
    if (this.logLevel <= LogLevel.DEBUG) {
      const formattedMessage = this.formatMessage('DEBUG', message, data);
      console.log(formattedMessage);
      this.writeToFile(formattedMessage);
    }
  }

  info(message: string, data?: any): void {
    if (this.logLevel <= LogLevel.INFO) {
      const formattedMessage = this.formatMessage('INFO', message, data);
      console.info(formattedMessage);
      this.writeToFile(formattedMessage);
    }
  }

  warn(message: string, data?: any): void {
    if (this.logLevel <= LogLevel.WARN) {
      const formattedMessage = this.formatMessage('WARN', message, data);
      console.warn(formattedMessage);
      this.writeToFile(formattedMessage);
    }
  }

  error(message: string, data?: any): void {
    if (this.logLevel <= LogLevel.ERROR) {
      const formattedMessage = this.formatMessage('ERROR', message, data);
      console.error(formattedMessage);
      this.writeToFile(formattedMessage);
    }
  }

  // Test-specific logging methods
  testStart(testName: string): void {
    this.info(`🧪 Starting test: ${testName}`);
  }

  testEnd(testName: string, duration: number): void {
    this.info(`✅ Test completed: ${testName} (${duration}ms)`);
  }

  testFail(testName: string, error: string): void {
    this.error(`❌ Test failed: ${testName}`, { error });
  }

  step(stepName: string): void {
    this.info(`📝 Step: ${stepName}`);
  }

  assertion(description: string, result: boolean): void {
    if (result) {
      this.debug(`✅ Assertion passed: ${description}`);
    } else {
      this.warn(`⚠️ Assertion failed: ${description}`);
    }
  }

  // Page object logging
  pageAction(action: string, element?: string): void {
    this.debug(`🖱️ Page action: ${action}${element ? ` on ${element}` : ''}`);
  }

  // API logging
  apiRequest(method: string, url: string, data?: any): void {
    this.debug(`🌐 API ${method}: ${url}`, data);
  }

  apiResponse(status: number, url: string, data?: any): void {
    this.debug(`📡 API Response (${status}): ${url}`, data);
  }
}

// Export singleton instance
export const logger = Logger.getInstance(); 