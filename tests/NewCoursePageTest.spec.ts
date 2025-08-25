import { test, expect } from '@playwright/test';
import { NewCoursePage } from '../pages/NewCoursePage';
import { LoginPage } from '../pages/LoginPage';
import { PhonePopupPage } from '../pages/PhonePopupPage';
import { HomePage } from '../pages/HomePage';
import { logger } from '../utilities/loggers';

test.describe('New Course Tests', () => {
    let newCoursePage: NewCoursePage;
    let loginPage: LoginPage;
    let phonePopupPage: PhonePopupPage;
    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
        newCoursePage = new NewCoursePage(page);
        loginPage = new LoginPage(page);
        phonePopupPage = new PhonePopupPage(page);
        homePage = new HomePage(page);
        
        // Setup: Login, close phone popup, and create a new course
        await loginPage.goToLogin();
        await loginPage.login('raghad.a+QAmember@msaaq.com', 'dadad2##2@sdds');
        await phonePopupPage.addPhoneLater();
        await homePage.addNewCourse();
        await homePage.addCourseTitle('Test Course');
        await homePage.selectCourseType();
        await homePage.submitCourse();
    });

    test('submit new item successfully and should select newly added item', async ({ page }) => {
        logger.step("🧪 Test Execution: Adding new item on course");
        await newCoursePage.addNewItemOnCourse();
        logger.step("🧪 Test Execution: Adding title to the new item");
        await newCoursePage.addNewItemOnCourseTitle('Test Chapter');
        logger.step("🧪 Test Execution: Submitting the new item");
        await newCoursePage.addNewItemOnCourseSubmit();
        logger.step("🧪 Test Execution: Selecting the newly added item");
        await newCoursePage.selectNewlyAddedItem();
        logger.step("🧪 Test Execution: New item submission and selection test completed successfully");
    
    });

});
