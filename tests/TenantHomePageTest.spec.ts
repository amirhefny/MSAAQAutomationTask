import { test, expect } from '@playwright/test';
import { TenantHomePage } from '../pages/TenantHomePage';
import { LoginPage } from '../pages/LoginPage';
import { PhonePopupPage } from '../pages/PhonePopupPage';
import { HomePage } from '../pages/HomePage';
import { CoursePublishPage } from '../pages/CoursePublishPage';
import { NewCoursePage } from '../pages/NewCoursePage';
import { CoursePartsPage } from '../pages/CoursePartsPage';
import { CourseSettingsPage } from '../pages/CourseSettingsPage';
import { logger } from '../utilities/loggers';

test.describe('Tenant Home Tests', () => {
    let tenantHomePage: TenantHomePage;
    let loginPage: LoginPage;
    let phonePopupPage: PhonePopupPage;
    let homePage: HomePage;
    let coursePublishPage: CoursePublishPage;
    let newCoursePage: NewCoursePage;
    let coursePartsPage: CoursePartsPage;
    let courseSettingsPage: CourseSettingsPage;

    test.beforeEach(async ({ page }) => {
        tenantHomePage = new TenantHomePage(page);
        loginPage = new LoginPage(page);
        phonePopupPage = new PhonePopupPage(page);
        homePage = new HomePage(page);
        coursePublishPage = new CoursePublishPage(page);
        newCoursePage = new NewCoursePage(page);
        coursePartsPage = new CoursePartsPage(page);
        courseSettingsPage = new CourseSettingsPage(page);
        
        await loginPage.goToLogin();
        await loginPage.login('raghad.a+QAmember@msaaq.com', 'dadad2##2@sdds');
        await phonePopupPage.addPhoneLater();
        await homePage.addNewCourse();
        await homePage.addCourseTitle('Cypress Course');
        await homePage.selectCourseType();
        await homePage.submitCourse();
        await newCoursePage.addNewItemOnCourse();
        await newCoursePage.addNewItemOnCourseTitle('Chapter 1: Introduction to Cypress');
        await newCoursePage.addNewItemOnCourseSubmit();
        await newCoursePage.selectNewlyAddedItem();
        await coursePartsPage.addTextToCourse('Introduction to Cypress','Cypress is a JavaScript-based end-to-end testing framework');

        await coursePartsPage.selectTheExam();
        await coursePartsPage.addExamTitle('Exam 1: Basics of Cypress');
        await coursePartsPage.submitExam();
        await coursePartsPage.examAdditionalSettingsClick();
        
        await coursePartsPage.retakeExam();
        await coursePartsPage.randomQuestion();
        await coursePartsPage.examSettingsSave();

        await courseSettingsPage.courseSettings();
        await courseSettingsPage.courseDuration('30');
        await courseSettingsPage.selectInstructorsForTheCourse();
        await courseSettingsPage.selectCourseCategory();
        await courseSettingsPage.uploadCoursePhotoAndSaveCourseSetting('CoursePhoto/images.png');

        
        await coursePublishPage.publishCourseSection();
    });


    test('check the published course from Tenant website @end-to-end', async ({ page }) => {
        logger.step("🧪 Test Execution: Opening tenant home page");
        await tenantHomePage.openTenantPage();
        logger.step("🧪 Test Execution: Checking for the published course");
        await tenantHomePage.checkPublishedCourse();
        logger.step("🧪 Test Execution: Published course verification completed successfully");
        
    });

});
