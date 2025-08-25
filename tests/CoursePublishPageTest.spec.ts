import { test, expect } from '@playwright/test';
import { CoursePublishPage } from '../pages/CoursePublishPage';
import { LoginPage } from '../pages/LoginPage';
import { PhonePopupPage } from '../pages/PhonePopupPage';
import { HomePage } from '../pages/HomePage';
import { CourseSettingsPage } from '../pages/CourseSettingsPage';
import { logger } from '../utilities/loggers';  

test.describe('Course Publish Tests', () => {
    let coursePublishPage: CoursePublishPage;
    let loginPage: LoginPage;
    let phonePopupPage: PhonePopupPage;
    let homePage: HomePage;
    let courseSettingsPage: CourseSettingsPage;

    test.beforeEach(async ({ page }) => {
        coursePublishPage = new CoursePublishPage(page);
        loginPage = new LoginPage(page);
        phonePopupPage = new PhonePopupPage(page);
        homePage = new HomePage(page);
        courseSettingsPage = new CourseSettingsPage(page);
        
        // Setup: Login, create course, configure settings
        await loginPage.goToLogin();
        await loginPage.login('raghad.a+QAmember@msaaq.com', 'dadad2##2@sdds');
        await phonePopupPage.addPhoneLater();
        await homePage.addNewCourse();
        await homePage.addCourseTitle('Test Course');
        await homePage.selectCourseType();
        await homePage.submitCourse();
        await courseSettingsPage.courseSettings();
        await courseSettingsPage.courseDuration('30');
        await courseSettingsPage.selectInstructorsForTheCourse();
        await courseSettingsPage.selectCourseCategory();
        await courseSettingsPage.uploadCoursePhotoAndSaveCourseSetting('/Users/amir.esmail1/Downloads/automation/Task/CoursePhoto/images.png');
    });


    test('should enable publish course checkbox', async ({ page }) => {
        logger.step("🧪 Test Execution: Accessing course publish section");
        await expect(page.locator("a[href$='publishing']")).toBeVisible();
        logger.step("🧪 Test Execution: Navigating to course publish section");
        await coursePublishPage.publishCourseSection();
        logger.step("🧪 Test Execution: Verifying publish course checkbox is enabled");
        await expect(page.locator("//button[@value='published']")).toBeChecked();
    });

});
