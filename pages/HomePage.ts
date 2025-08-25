import { Page } from "@playwright/test";
import { expect } from '@playwright/test';
import { BasePage } from "./BasePage";
import { logger } from "../utilities/loggers";

export class HomePage extends BasePage {
    page: Page;
    
    constructor(page: Page) {
        super(page);
        this.page = page;
    }

    private closeChatPopup = () => this.page.locator("//span[@class='cc-1x4xm cc-sdm9t']");
    private newCourseButton = () => this.page.locator("//button[@type='button' and contains(@class, 'bg-background') and normalize-space(.)='إضافة جديد']");
    private courseTitleInput = () => this.page.locator("input[id$='-form-item']");
    private courseType = () => this.page.locator("(//button[@id='type-course'])[1]");
    private submitCourseButton = () => this.page.locator("(//div[@class='sm:flex-row sm:justify-start sm:gap-x-2 flex flex-col-reverse'])[1]");

    //@description: click to add new course 
    //@returns: void
    async addNewCourse() {
        logger.step("🏠 HomePage: Adding new course");
        await this.click(this.newCourseButton());
        logger.step("🏠 HomePage: New course button clicked successfully");
    }

    //@description: click to write the course title
    //@returns: void
    async clickCourseTitle() {
        logger.step("🏠 HomePage: Clicking course title input");
        await this.click(this.courseTitleInput())
        logger.step("🏠 HomePage: Course title input clicked successfully");
    }

    //@param title: string
    //@description: write the course title
    //@returns: void
    async addCourseTitle(title: string) {
        logger.step(`🏠 HomePage: Adding course title: "${title}"`);
        await this.fillInput(this.courseTitleInput(),title)
        logger.step(`HomePage: Course title "${title}" added successfully`);
    }

    //@description: select the course type
    //@returns: void
    async selectCourseType() {
        logger.step("🏠 HomePage: Selecting course type");
        await this.click(this.courseType());
        await expect(this.courseType()).toBeChecked();
        logger.step("🏠 HomePage: Course type selected and verified successfully");
    }

    //@description: submit the course and close the chat bot popup if it is displayed
    //@returns: void
    async submitCourse() {
        logger.step("🏠 HomePage: Submitting course");
        await this.click(this.submitCourseButton());
        await this.waitForTimeoutInSeconds(3);
        
        logger.step("🏠 HomePage: Checking for chat popup");
        if(await this.isElementVisible(this.closeChatPopup())){
            logger.step("🏠 HomePage: Chat popup detected, closing it");
            await this.click(this.closeChatPopup());
            logger.step("🏠 HomePage: Chat popup closed successfully");
        } 
            logger.step("🏠 HomePage: No chat popup chat bot detected");
        
        logger.step("🏠 HomePage: Course submitted successfully");
    }
}
