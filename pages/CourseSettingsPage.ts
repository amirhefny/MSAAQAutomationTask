import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { logger } from "../utilities/loggers";

export class CourseSettingsPage extends BasePage {
    page: Page;
    
    constructor(page: Page) {
        super(page);
        this.page = page;
    }

    private couseSettings = () => this.page.locator("a[href$='settings']");
    private selectInstructor = () => this.page.locator("(//input[@class='select__input'])[2]");
    private instructorName = () => this.page.locator("//div/span[contains(text(), 'Isra')]");
    private courseTime = () => this.page.locator("//input[@list='duration-hours']");
    private courseCategory = () => this.page.locator("(//input[@class='select__input'])[7]");
    private saveCourseSettings = () => this.page.locator("//div[@id='sidebar']/button[1]");

    
    //@description: Navigate to course setting
    //@returns: void
    async courseSettings() {
        logger.step("CourseSettingsPage: Navigating to course settings");
        await this.click(this.couseSettings());
        logger.step("CourseSettingsPage: Successfully navigated to course settings");
    }

    //@description: set the course duration in hours 
    //@param: time: string
    //@returns: void
    async courseDuration(time: string) {
        logger.step("CourseSettingsPage: Setting course duration to: in hours " + time);
        await this.courseTime().fill(time);
        logger.step("CourseSettingsPage: Course duration set to: in hours"+ time);
    }

    //@description: select the course instructors
    //@returns: void
    async selectInstructorsForTheCourse() {
        logger.step("CourseSettingsPage: Selecting instructor for the course");
        
        logger.step("CourseSettingsPage: Clicking instructor dropdown");
        await this.click(this.selectInstructor());
        
        logger.step("CourseSettingsPage: Waiting for instructor options to load");
        await this.waitForTimeoutInSeconds(2);
        
        logger.step("CourseSettingsPage: Selecting instructor");

        await this.click(this.instructorName(), {force : true})
        
        logger.step("CourseSettingsPage: Instructor selected successfully");
    }

    //@description: select the course category
    //@returns: void
    async selectCourseCategory() {
        logger.step("CourseSettingsPage: Selecting course category");
        
        logger.step("CourseSettingsPage: Clicking category dropdown");
        await this.click(this.courseCategory());
        
        logger.step("CourseSettingsPage: Filling category with 'غ'");
        await this.fillInput(this.courseCategory(), 'غ');
        
        logger.step("CourseSettingsPage: Waiting for category options to load");
        await this.waitForTimeoutInSeconds(1);
        
        logger.step("CourseSettingsPage: Pressing Enter to confirm category");
        //await this.page.keyboard.press('Enter');
        await this.pressKey('Enter');
        
        logger.step("CourseSettingsPage: Course category selected successfully");
    }

    //@description: upload Course Photo and save the course settings 
    //@param: filePath: string
    //@returns: void
    async uploadCoursePhotoAndSaveCourseSetting(filePath: string) {
        logger.step("CourseSettingsPage: Uploading course photo from: ${filePath}");
        
        logger.step("CourseSettingsPage: Setting file input (foto)");
        await this.page.setInputFiles("//input[@class='sr-only']", filePath);
        
        logger.step("CourseSettingsPage: Clicking save course settings button");
        await this.click(this.saveCourseSettings());
        
        logger.step("CourseSettingsPage: Course photo uploaded and settings saved successfully");
    }
}
