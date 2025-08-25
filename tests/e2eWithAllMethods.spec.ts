import {test, expect} from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { PhonePopupPage } from '../pages/PhonePopupPage';
import { HomePage } from '../pages/HomePage';
import { NewCoursePage } from '../pages/NewCoursePage';
import { CoursePartsPage } from '../pages/CoursePartsPage';
import { CourseSettingsPage } from '../pages/CourseSettingsPage';
import { CoursePublishPage } from '../pages/CoursePublishPage';
import { TenantHomePage } from '../pages/TenantHomePage';

test.describe('Login Tests', () => {
    let loginPage: LoginPage;
    let phonePopupPage: PhonePopupPage;
    let homePage: HomePage;
    let newCoursePage: NewCoursePage;
    let coursePartsPage: CoursePartsPage;
    let courseSettingsPage: CourseSettingsPage;
    let coursePublishPage: CoursePublishPage;
    let tenantHomePage: TenantHomePage;

    //This will run before each test in this describe block
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        phonePopupPage = new PhonePopupPage(page);
        homePage = new HomePage(page);
        newCoursePage = new NewCoursePage(page);
        coursePartsPage = new CoursePartsPage(page);
        courseSettingsPage = new CourseSettingsPage(page);
        coursePublishPage = new CoursePublishPage(page);
        tenantHomePage = new TenantHomePage(page);
        
        await loginPage.goToLogin();
    });
    
    test('End to End scenario with all methods', async ({ page }) => {
    
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
        await coursePartsPage.examAdditionalSettingsClick();

        await courseSettingsPage.courseSettings();
        await courseSettingsPage.courseDuration('30');
        await courseSettingsPage.selectInstructorsForTheCourse();
        await courseSettingsPage.selectCourseCategory();
        await courseSettingsPage.uploadCoursePhotoAndSaveCourseSetting('/Users/amir.esmail1/Downloads/automation/Task/CoursePhoto/images.png');

        await coursePublishPage.publishCourseSection();
        await tenantHomePage.openTenantPage();
        await tenantHomePage.checkPublishedCourse();

        await page.waitForTimeout(30000); // Wait for 3 seconds
    });
});