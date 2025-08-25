import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { logger } from "../utilities/loggers";

export class CoursePublishPage extends BasePage {
    page: Page;
    
    constructor(page: Page) {
        super(page);
        this.page = page;
    }

    private publisgCourseSettings = () => this.page.locator("a[href$='publishing']"); 
    private publishCourseCheckbox = () => this.page.locator("//button[@value='published']");
    private puplishCourseSubmitButton = () => this.page.locator("//button[@type='submit']");

    //@description: publish the course for users
    //@returns: void
    async publishCourseSection() {
        logger.step("📢 CoursePublishPage: Navigating to course publishing section");
        await this.click(this.publisgCourseSettings());
        
        logger.step("📢 CoursePublishPage: Enabling publish course checkbox");
        await this.click(this.publishCourseCheckbox());
        
        logger.step("📢 CoursePublishPage: Submitting course for publishing");
        await this.click(this.puplishCourseSubmitButton());
        
        logger.step("📢 CoursePublishPage: Course published successfully");
    }
}
