# 🚀 Enhanced Logging System for Playwright Framework

## Overview
This framework includes a comprehensive logging system that provides detailed insights into test execution, page interactions, and system performance. The logging system is designed to be both developer-friendly and production-ready.

## 🎯 Features

### **1. Multi-Level Logging**
- **DEBUG**: Detailed debugging information
- **INFO**: General information and successful operations
- **WARN**: Warning messages and non-critical issues
- **ERROR**: Error messages and failures
- **NONE**: Disable all logging

### **2. Specialized Logging Methods**

#### **Test Lifecycle Logging**
```typescript
logger.testStart('Test Name');           // 🧪 Starting test: Test Name
logger.testEnd('Test Name', duration);   // ✅ Test completed: Test Name (1234ms)
logger.testFail('Test Name', error);     // ❌ Test failed: Test Name
logger.step('Step description');         // 📝 Step: Step description
```

#### **Page Object Logging**
```typescript
logger.pageAction('Click', 'Submit button');           // 🖱️ Page action: Click on Submit button
logger.elementInteraction('Input field', 'Fill', 'text'); // 🎯 Element Interaction - Fill on Input field: text
logger.navigation('Login page', 'Home page');          // 🧭 Navigation: Login page → Home page
```

#### **Course-Specific Logging**
```typescript
logger.courseCreation('Course Name', 'Started');      // 📚 Course Creation - Started: Course Name
logger.coursePublishing('Course Name', 'Completed');  // 🚀 Course Publishing - Completed: Course Name
logger.courseContent('Chapter', 'Adding', 'Title');   // 📖 Course Content - Adding Chapter: Title
logger.courseSettings('Publish status', 'Enabled');   //  Course Settings - Publish status: Enabled
```

#### **Validation and Performance**
```typescript
logger.validation('Element', true, 'Success message'); // ✅ Validation passed: Element - Success message
logger.performance('Operation', 1234);                 // ⏱️ Performance - Operation: 1234ms
logger.errorContext('Context', error, additionalData); // 💥 Error in Context
```

### **3. CSV Operations Logging**
```typescript
logger.csvOperation('Reading', 'data.csv', 100);      // 📊 CSV Reading: data.csv (100 records)
logger.csvOperation('Writing', 'output.csv', 50);     // 📊 CSV Writing: output.csv (50 records)
```

## 📁 File Structure

```
utilities/
├── loggers.ts           # Main logger class and methods
├── loggerConfig.ts      # Configuration and environment settings
└── LOGGING_README.md    # This documentation file
```

## 🚀 Usage Examples

### **Basic Page Object Logging**
```typescript
import { logger } from '../utilities/loggers';

export class LoginPage extends BasePage {
    constructor(page: Page) {
        super(page);
        logger.info(`🔐 LoginPage initialized for URL: ${page.url()}`);
    }

    async login(username: string, password: string) {
        logger.loginAttempt(username, 'Started');
        logger.step(`Login with username: ${username}`);
        
        try {
            // ... login logic ...
            logger.loginAttempt(username, 'Completed');
            logger.info(`✅ Login successful for user: ${username}`);
        } catch (error) {
            logger.errorContext('Login process', error, { username });
            logger.loginAttempt(username, 'Failed');
            throw error;
        }
    }
}
```

### **Test File Logging**
```typescript
test('should login successfully', async ({ page }) => {
    const testName = 'Login Test';
    const startTime = Date.now();
    
    logger.testStart(testName);
    
    try {
        logger.step('Navigate to login page');
        await loginPage.goToLogin();
        
        logger.step('Perform login');
        await loginPage.login(username, password);
        
        const duration = Date.now() - startTime;
        logger.testEnd(testName, duration);
        logger.performance('Login test execution', duration);
        
    } catch (error) {
        const duration = Date.now() - startTime;
        logger.testFail(testName, String(error));
        throw error;
    }
});
```

### **CSV Operations Logging**
```typescript
const csvReader = new CSVReader();
logger.info(`📊 CSVReader initialized with data path: data`);

try {
    const data = await csvReader.readCSV<LoginData>('login_data.csv');
    logger.csvOperation('Read successfully', 'login_data.csv', data.length);
    logger.info(`✅ Successfully read ${data.length} records from login_data.csv`);
} catch (error) {
    logger.errorContext('CSV file reading', error, { filename: 'login_data.csv' });
}
```

## ⚙️ Configuration

### **Environment-Based Configuration**
```typescript
import { getLoggerConfig, updateLoggerConfig } from './loggerConfig';

// Get configuration based on NODE_ENV
const config = getLoggerConfig();

// Runtime configuration updates
updateLoggerConfig({ logLevel: LogLevel.DEBUG });
```

### **Configuration Options**
```typescript
export interface LoggerConfig {
  logLevel: LogLevel;                    // Logging level
  enableConsoleOutput: boolean;          // Console output
  enableFileOutput: boolean;             // File output
  enablePerformanceLogging: boolean;     // Performance metrics
  enableElementInteractionLogging: boolean; // Element interactions
  enableTestDataLogging: boolean;        // Test data logging
  maxLogFileSize: number;                // Max log file size (MB)
  logFileRetention: number;              // Log retention (days)
}
```

### **Predefined Configurations**
- **`defaultLoggerConfig`**: Balanced logging for development
- **`debugLoggerConfig`**: Maximum logging for debugging
- **`productionLoggerConfig`**: Minimal logging for production
- **`testLoggerConfig`**: Optimized for test execution

## 📊 Log Output Examples

### **Console Output**
```
[2024-01-15T10:30:00.000Z] [INFO] 🧪 Starting test: Login Test
[2024-01-15T10:30:00.100Z] [INFO] 📝 Step: Navigate to login page
[2024-01-15T10:30:00.200Z] [INFO] 🖱️ Page action: Navigate to login page on /
[2024-01-15T10:30:00.500Z] [INFO] ✅ Successfully navigated to login page
[2024-01-15T10:30:00.600Z] [INFO] 📝 Step: Perform login
[2024-01-15T10:30:00.700Z] [INFO] 🔐 Login Attempt - Started: user@example.com
[2024-01-15T10:30:01.000Z] [INFO] ✅ Login successful for user: user@example.com
[2024-01-15T10:30:01.100Z] [INFO] ✅ Test completed: Login Test (1100ms)
[2024-01-15T10:30:01.100Z] [DEBUG] ⏱️ Performance - Login test execution: 1100ms
```

### **File Output**
Logs are automatically written to `logs/test-YYYY-MM-DD.log` with the same format as console output.

## 🔧 Customization

### **Adding Custom Logging Methods**
```typescript
// In loggers.ts
export class Logger {
  // ... existing methods ...
  
  customOperation(operation: string, details: any): void {
    this.info(`🔧 Custom Operation - ${operation}`, details);
  }
}
```

### **Custom Log Formats**
```typescript
private formatMessage(level: string, message: string, data?: any): string {
  const timestamp = new Date().toISOString();
  const customFormat = `[${timestamp}] [${level}] [CUSTOM] ${message}`;
  
  if (data) {
    return `${customFormat} ${JSON.stringify(data, null, 2)}`;
  }
  
  return customFormat;
}
```

## 🎨 Emojis and Visual Indicators

The logging system uses emojis to make logs more readable and visually appealing:

- 🧪 Test operations
- 📝 Test steps
- ✅ Success operations
- ❌ Failed operations
- 🖱️ Page actions
- 🎯 Element interactions
- 🧭 Navigation
- 📚 Course operations
- 🚀 Publishing operations
- ⚙️ Settings
- 📊 CSV operations
- ⏱️ Performance metrics
- 💥 Errors
- 🔐 Login operations
- 🏠 Home page
- 📖 Course content
- 🏢 Tenant operations
- 📱 Popup operations

## 🚀 Best Practices

1. **Use Appropriate Log Levels**: DEBUG for development, INFO for general use, WARN for issues, ERROR for failures
2. **Include Context**: Always provide relevant context in error logs
3. **Performance Logging**: Use performance logging for time-sensitive operations
4. **Structured Data**: Use the data parameter for complex information
5. **Consistent Naming**: Use consistent naming conventions for elements and operations
6. **Error Handling**: Always log errors with proper context and stack traces

## 🔍 Troubleshooting

### **Common Issues**

1. **Logs not appearing**: Check log level configuration
2. **File permissions**: Ensure write access to logs directory
3. **Performance impact**: Disable detailed logging in production
4. **Memory usage**: Monitor log file sizes and retention settings

### **Debug Mode**
```typescript
// Set to debug level for maximum information
logger.setLogLevel(LogLevel.DEBUG);
```

## 📈 Performance Impact

- **Console logging**: Minimal impact
- **File logging**: Small I/O overhead
- **Performance logging**: Negligible timing impact
- **Element interaction logging**: No impact on test execution

## 🔮 Future Enhancements

- [ ] Log aggregation and analysis
- [ ] Real-time log streaming
- [ ] Integration with external logging services
- [ ] Advanced filtering and search capabilities
- [ ] Log compression and archiving
- [ ] Performance trend analysis

---

