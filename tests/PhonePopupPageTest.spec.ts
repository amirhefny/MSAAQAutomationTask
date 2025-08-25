import { test, expect } from '@playwright/test';
import { PhonePopupPage } from '../pages/PhonePopupPage';
import { LoginPage } from '../pages/LoginPage';
import { logger } from '../utilities/loggers';

test.describe('Phone Popup Tests', () => {
    let phonePopupPage: PhonePopupPage;
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        phonePopupPage = new PhonePopupPage(page);
        loginPage = new LoginPage(page);
    });


    test('should close phone popup when clicking add phone later', async ({ page }) => {
        await loginPage.goToLogin();
        await loginPage.login('raghad.a+QAmember@msaaq.com', 'dadad2##2@sdds');
        await phonePopupPage.addPhoneLater();
        logger.step("🧪 Test Execution: Verifying phone popup is closed");
        await expect(page.locator("//div[contains(@class, 'flex-col')]/button[2]")).not.toBeVisible();
        logger.step("🧪 Test Execution: Phone popup closed successfully");
        await expect(page).toHaveTitle('الرئيسية - لوحة التحكم - مساق');
        logger.step("🧪 Test Execution: Verified navigation to home page successfully");

    });
});
