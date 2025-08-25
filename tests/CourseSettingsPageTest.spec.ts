import { test, expect } from '@playwright/test';
import { CourseSettingsPage } from '../pages/CourseSettingsPage';
import { LoginPage } from '../pages/LoginPage';
import { PhonePopupPage } from '../pages/PhonePopupPage';
import { HomePage } from '../pages/HomePage';
import { logger } from '../utilities/loggers';

test.describe('Course Settings Tests', () => {
    let courseSettingsPage: CourseSettingsPage;
    let loginPage: LoginPage;
    let phonePopupPage: PhonePopupPage;
    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
        courseSettingsPage = new CourseSettingsPage(page);
        loginPage = new LoginPage(page);
        phonePopupPage = new PhonePopupPage(page);
        homePage = new HomePage(page);
        
        await loginPage.goToLogin();
        await loginPage.login('raghad.a+QAmember@msaaq.com', 'dadad2##2@sdds');
        await phonePopupPage.addPhoneLater();
        await homePage.addNewCourse();
        await homePage.addCourseTitle('Test Course');
        await homePage.selectCourseType();
        await homePage.submitCourse();
    });

    test('should display course settings link', async ({ page }) => {
        await expect(page.locator("a[href$='settings']")).toBeVisible();
    
    });


    test('should save course settings', async ({ page }) => {
        await expect(page.locator("a[href$='settings']")).toBeVisible();
        logger.step("🧪 Test Execution: Accessing course settings");
        await courseSettingsPage.courseSettings();
        logger.step("🧪 Test Execution: Setting course duration");
        await courseSettingsPage.courseDuration('30');
        logger.step("🧪 Test Execution: Selecting instructors for the course");
        await courseSettingsPage.selectInstructorsForTheCourse();
        logger.step("🧪 Test Execution: Selecting course category");
        await courseSettingsPage.selectCourseCategory();
        logger.step("🧪 Test Execution: Uploading course photo and saving course settings");
        await courseSettingsPage.uploadCoursePhotoAndSaveCourseSetting('/Users/amir.esmail1/Downloads/automation/Task/CoursePhoto/images.png');
        logger.step("🧪 Test Execution: Course settings saved successfully");
    });

    test('should handle invalid course duration', async ({ page }) => {
        logger.step("🧪 Test Execution: Accessing course settings");
        await courseSettingsPage.courseSettings();
        logger.step("🧪 Test Execution: Setting invalid course duration");
        await courseSettingsPage.courseDuration('.');
    });
});
