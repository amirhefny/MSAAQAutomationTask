import { test, expect } from '@playwright/test';
import { TenantHomePage } from '../pages/TenantHomePage';
import { LoginPage } from '../pages/LoginPage';
import { PhonePopupPage } from '../pages/PhonePopupPage';
import { HomePage } from '../pages/HomePage';
import { CoursePublishPage } from '../pages/CoursePublishPage';
import { logger } from '../utilities/loggers';

test.describe('Tenant Home Tests', () => {
    let tenantHomePage: TenantHomePage;
    let loginPage: LoginPage;
    let phonePopupPage: PhonePopupPage;
    let homePage: HomePage;
    let coursePublishPage: CoursePublishPage;

    test.beforeEach(async ({ page }) => {
        tenantHomePage = new TenantHomePage(page);
        loginPage = new LoginPage(page);
        phonePopupPage = new PhonePopupPage(page);
        homePage = new HomePage(page);
        coursePublishPage = new CoursePublishPage(page);
        
        
        await loginPage.goToLogin();
        await loginPage.login('raghad.a+QAmember@msaaq.com', 'dadad2##2@sdds');
        await phonePopupPage.addPhoneLater();
        await homePage.addNewCourse();
        await homePage.addCourseTitle('Cypress Course');
        await homePage.selectCourseType();
        await homePage.submitCourse();
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
