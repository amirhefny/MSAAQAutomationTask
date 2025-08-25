import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { CSVReader } from '../utilities/CSVReader';
import { logger } from '../utilities/loggers';

// interface for login data
interface LoginData {
  username: string;
  password: string;
}

test.describe('Login Tests', () => {
    let loginPage: LoginPage;
    let csvReader: CSVReader;
    let testData: LoginData[];

    test.beforeAll(async () => {
        csvReader = new CSVReader();
        testData = await csvReader.readCSV<LoginData>('login_data.csv');
    });

    test.beforeEach(async ({ page }) => {
        logger.step("🧪 Test Setup: Initializing LoginPage");
        loginPage = new LoginPage(page);
    });

    test('should login with valid credentials from CSV', async ({ page }) => {
        const validCredentials = testData.find(data => data.username && data.password);
        if (!validCredentials) {
            test.skip(true, 'No valid credentials found in CSV');
            return;
        }
        await loginPage.goToLogin();
        await logger.step("🧪 Test Execution: Logging in with valid credentials from CSV");
        await loginPage.login(validCredentials.username, validCredentials.password);
        
    });
});
