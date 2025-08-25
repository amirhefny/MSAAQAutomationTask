import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { logger } from "../utilities/loggers";

export class NewCoursePage extends BasePage {
    page: Page;
    
    constructor(page: Page) {
        super(page);
        this.page = page;
    }

    private addNewItemOnCourseButton = () => this.page.locator("//button[@data-tour='add-chapter']");
    private addNewItemOnCourseInput = () => this.page.locator("//input[@name='title']");
    private addNewItemOnCourseSubmitButton = () => this.page.locator("//div[contains(@class,'sm:flex-row')]//button[normalize-space(text())='إضافة جديد']");
    private selectNewItem = () => this.page.locator("//h3[@data-state='closed']");

    //@description: add new item(Content) to the course
    //@returns: void
    async addNewItemOnCourse() {
        logger.step("📚 NewCoursePage: Clicking 'Add New Item' button to add new Content to the course");
        await this.click(this.addNewItemOnCourseButton());
        logger.step("📚 NewCoursePage: Successfully clicked 'Add New Item' button");
    }

    //@description: add the title for the new item
    //@param title: string
    //@returns: void
    async addNewItemOnCourseTitle(title: string) {
        logger.step(`📚 NewCoursePage: Adding title for new item: "${title}"`);
        await this.fillInput(this.addNewItemOnCourseInput(),title)
        logger.step(`📚 NewCoursePage: Successfully added title: "${title}"`);
    }

    //@description: submit the new item 
    //@returns: void
    async addNewItemOnCourseSubmit() {
        logger.step("📚 NewCoursePage: Submitting new item");
        await this.click(this.addNewItemOnCourseSubmitButton());
        logger.step("📚 NewCoursePage: Successfully submitted new item");
    }

    //@description: select the new item after added
    //@returns: void
    async selectNewlyAddedItem() {
        logger.step("📚 NewCoursePage: Selecting newly added item");
        await this.click(this.selectNewItem());
        logger.step("📚 NewCoursePage: Successfully selected newly added item");
    }
}
