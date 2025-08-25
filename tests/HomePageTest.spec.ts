import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { PhonePopupPage } from '../pages/PhonePopupPage';
import { logger } from '../utilities/loggers';

test.describe('Home Tests', () => {
    let homePage: HomePage;
    let loginPage: LoginPage;
    let phonePopupPage: PhonePopupPage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        loginPage = new LoginPage(page);
        phonePopupPage = new PhonePopupPage(page);
        
        // Setup: Login and close phone popup
        await loginPage.goToLogin();
        await loginPage.login('raghad.a+QAmember@msaaq.com', 'dadad2##2@sdds');
        await phonePopupPage.addPhoneLater();
    });


    test('submit course', async ({ page }) => {

        logger.step("🧪 Test Execution: Adding new course");
        await homePage.addNewCourse();
        logger.step("🧪 Test Execution: Adding course title");
        await homePage.addCourseTitle('Test Course');
        logger.step("🧪 Test Execution: Selecting course type");
        await homePage.selectCourseType();
        logger.step("🧪 Test Execution: Submitting course");
        await homePage.submitCourse();
        logger.step("🧪 Test Execution: Course submission test completed successfully");
    });


});
