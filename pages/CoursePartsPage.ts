import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { logger } from "../utilities/loggers";

export class CoursePartsPage extends BasePage {
    page: Page;
    
    constructor(page: Page) {
        super(page);
        this.page = page;
    }

    private addTextCourse = () => this.page.locator("//div[@class='grid w-full grid-cols-3 gap-3']//a[5]");
    private addTextTitleInput = () => this.page.locator("//input[@name='title']");
    private addTextContentInput = () => this.page.locator("(//div[@class='tiptap ProseMirror focus:outline-none p-5 h-full undefined'])[1]");
    private addNewTextCourseSubmitButton = () => this.page.locator("//div[@id='sidebar']//button[@type='submit']");
    private selectNewItem = () => this.page.locator("//h3[@data-state='closed']");
    private selectExam = () => this.page.locator("//div[@ class ='flex justify-between']//button");
    private examTitle = () => this.page.locator("//div[@ class ='space-y-2']//input");
    private submitExamButton = () => this.page.locator("//div[contains(@class,'sm:flex-row')]//button[1]");
    private examAdditionalSettings = () => this.page.locator("(//h3[@class='text-xl font-medium'])[2]");
    private retakeExamButton = () => this.page.locator('(//button[@role="switch"])[7]');
    private randomQuestionButton = () => this.page.locator("(//button[contains(@id,'form-item')])[7]");
    private examSettingsSaveButton = () => this.page.locator("//div[@class='flex gap-3']//button[@type='submit']");

    //@description: add text to the course content 
    //@param courseContent: string , courseTitle: string
    //@returns: void
    async addTextToCourse(courseTitle: string,courseContent: string) {
        logger.step("📝 CoursePartsPage: Adding text content to course");
        
        logger.step("📝 CoursePartsPage: Clicking text course option");
        await this.click(this.addTextCourse())
        
        logger.step("📝 CoursePartsPage: Filling text title");
        await this.fillInput(this.addTextTitleInput(),courseTitle)
        
        logger.step("📝 CoursePartsPage: Filling text content");
        await this.fillInput(this.addTextContentInput(),courseContent)
        
        logger.step("📝 CoursePartsPage: Submitting text content");
        await this.click(this.addNewTextCourseSubmitButton());
        
        logger.step("📝 CoursePartsPage: Selecting new item");
        await this.click(this.selectNewItem());
        
        logger.step("📝 CoursePartsPage: Text content added successfully");
    }

    //@description: select the exam to add to the course
    //@returns: void
    async selectTheExam() {
        logger.step("📝 CoursePartsPage: Selecting exam option");
        await this.click(this.selectExam());
    }

    //@description: add the exam title
    //@param title: string
    //@returns: void
    async addExamTitle(title: string) {
        logger.step(`📝 CoursePartsPage: Adding exam title: "${title}"`);
        await this.fillInput(this.examTitle(),title)
        logger.step(`📝 CoursePartsPage: Exam title "${title}" added successfully`);
    }

    //@description: submit the exam to be added to the course 
    //@returns: void
    async submitExam() {
        logger.step("📝 CoursePartsPage: Submitting exam");
        await this.click(this.submitExamButton());
    }

    //@description: click the exam additional settings to add retake exam and random question
    //@returns: void
    async examAdditionalSettingsClick() {
        logger.step("📝 CoursePartsPage: Clicking exam additional settings");
        await this.click(this.examAdditionalSettings());
    }

    //@description: click the retake exam button
    //@returns: void
    async retakeExam() {
        await this.waitForTimeoutInSeconds(2);
        logger.step("📝 CoursePartsPage: Enabling retake exam option");
        await this.waitForTimeoutInSeconds(1);
        await this.click(this.retakeExamButton(), { force: true });
        logger.step("📝 CoursePartsPage: Retake exam option enabled successfully");
    }

    //@description: click the random question button
    //@returns: void
    async randomQuestion() {
        logger.step("📝 CoursePartsPage: Enabling random question option");
        await this.waitForTimeoutInSeconds(2);
        await this.page.locator('(//button[@role="switch"])[6]').click({ force: true });
        
        
    }

    //@description: click the exam settings save button and go back to the course parts page
    //@returns: void
    async examSettingsSave() {
        await this.click(this.examSettingsSaveButton());
        logger.step("📝 CoursePartsPage: Random question option enabled and settings saved");
        await this.waitForTimeoutInSeconds(2);
        await this.page.goBack();
        logger.step("Go back to the course parts page");
    }
}
