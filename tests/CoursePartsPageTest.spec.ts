import { test, expect } from '@playwright/test';
import { CoursePartsPage } from '../pages/CoursePartsPage';
import { LoginPage } from '../pages/LoginPage';
import { PhonePopupPage } from '../pages/PhonePopupPage';
import { HomePage } from '../pages/HomePage';
import { NewCoursePage } from '../pages/NewCoursePage';
import { logger } from '../utilities/loggers';

test.describe('Course Parts Tests', () => {
    let coursePartsPage: CoursePartsPage;
    let loginPage: LoginPage;
    let phonePopupPage: PhonePopupPage;
    let homePage: HomePage;
    let newCoursePage: NewCoursePage;

    test.beforeEach(async ({ page }) => {
        coursePartsPage = new CoursePartsPage(page);
        loginPage = new LoginPage(page);
        phonePopupPage = new PhonePopupPage(page);
        homePage = new HomePage(page);
        newCoursePage = new NewCoursePage(page);
        
    
        await loginPage.goToLogin();
        await loginPage.login('raghad.a+QAmember@msaaq.com', 'dadad2##2@sdds');
        await phonePopupPage.addPhoneLater();
        await homePage.addNewCourse();
        await homePage.addCourseTitle('Test Course');
        await homePage.selectCourseType();
        await homePage.submitCourse();
        await newCoursePage.addNewItemOnCourse();
        await newCoursePage.addNewItemOnCourseTitle('Test Chapter');
        await newCoursePage.addNewItemOnCourseSubmit();
        await newCoursePage.selectNewlyAddedItem();
    });


    test('access exam additional settings without retake exam and random option', async ({ page }) => {
        logger.step("🧪 Test Execution: Accessing exam additional settings");
        await coursePartsPage.selectTheExam();
        logger.step("🧪 Test Execution: Adding exam title");
        await coursePartsPage.addExamTitle('Test Exam');
        logger.step("🧪 Test Execution: Submitting the exam");
        await coursePartsPage.submitExam();
        logger.step("🧪 Test Execution: Clicking on exam additional settings");
        await coursePartsPage.examAdditionalSettingsClick();
        logger.step("🧪 Test Execution: Successfully accessed exam additional settings");
    });

    test('enable retake exam option with retake option', async ({ page }) => {
        logger.step("🧪 Test Execution: Accessing exam additional settings");
        await coursePartsPage.selectTheExam();
        logger.step("🧪 Test Execution: Adding exam title");
        await coursePartsPage.addExamTitle('Test Exam');
        logger.step("🧪 Test Execution: Submitting the exam");
        await coursePartsPage.submitExam();
        logger.step("🧪 Test Execution: Clicking on exam additional settings");
        await coursePartsPage.examAdditionalSettingsClick();
        logger.step("🧪 Test Execution: Enabling retake exam option");
        await coursePartsPage.retakeExam();
        logger.step("🧪 Test Execution: Saving exam settings");
        await coursePartsPage.examSettingsSave();
        logger.step("🧪 Test Execution: Retake exam option enabled and settings saved successfully");
        
    });

    test('enable random question option with random option', async ({ page }) => {
        logger.step("🧪 Test Execution: Accessing exam additional settings");
        await coursePartsPage.selectTheExam();
        logger.step("🧪 Test Execution: Adding exam title");
        await coursePartsPage.addExamTitle('Test Exam');
        logger.step("🧪 Test Execution: Submitting the exam");
        await coursePartsPage.submitExam();
        logger.step("🧪 Test Execution: Clicking on exam additional settings");
        await coursePartsPage.examAdditionalSettingsClick();
        logger.step("🧪 Test Execution: Enabling random question option");
        await coursePartsPage.randomQuestion();
        logger.step("🧪 Test Execution: Saving exam settings");
        await coursePartsPage.examSettingsSave();
        logger.step("🧪 Test Execution: Random question option enabled and settings saved successfully");
    });

    test('enable random question option with random option and retake option', async ({ page }) => {
        logger.step("🧪 Test Execution: Accessing exam additional settings");
        await coursePartsPage.selectTheExam();
        logger.step("🧪 Test Execution: Adding exam title");
        await coursePartsPage.addExamTitle('Test Exam');
        logger.step("🧪 Test Execution: Submitting the exam");
        await coursePartsPage.submitExam();
        logger.step("🧪 Test Execution: Clicking on exam additional settings");
        await coursePartsPage.examAdditionalSettingsClick();
        logger.step("🧪 Test Execution: Enabling random question option");
        await coursePartsPage.randomQuestion();
        logger.step("🧪 Test Execution: Enabling retake exam option");
        await coursePartsPage.retakeExam();
        logger.step("🧪 Test Execution: Saving exam settings");
        await coursePartsPage.examSettingsSave();
        logger.step("🧪 Test Execution: Random question and retake exam options enabled and settings saved successfully");
    });


});
