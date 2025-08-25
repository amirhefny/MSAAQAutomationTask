import { Page,expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { logger } from "../utilities/loggers";

export class TenantHomePage extends BasePage {
    page: Page;
    
    constructor(page: Page) {
        super(page);
        this.page = page;
    }

    private loginButton = () => this.page.locator("//a[@href='/login']");
    private emailInput = () => this.page.locator("//input[@type='email']");
    private emailNextButton = () => this.page.locator("//button[@type='submit']");
    private passwordInputField = () => this.page.locator("//input[@type='password']");
    private browseCoursesButton = () => this.page.locator("//div[@class='col-span-12 flex flex-wrap gap-3 justify-center']//a[@href='/courses']");


    //@description: open tenant home page 
    //@returns: void
    async openTenantPage() {
        logger.step("🏢 TenantHomePage: Opening tenant page in new tab");
        
        logger.step("🏢 TenantHomePage: Opening new tab and navigating to tenant page");
        await this.openInNewTabAndSwitch('https://qa-test.misklms.com/', {
            timeout: 30000,
            waitUntil: 'load'
        });
        
        logger.step("🏢 TenantHomePage: Successfully opened tenant page in new tab");
    }
    //@description: check that the course published on tenant correctly
    //@returns: void
    async checkPublishedCourse() {
        logger.step("🏢 TenantHomePage: Finding the course on tenant");
        await this.click(this.browseCoursesButton(), { force: true });
        
        logger.step("🏢 TenantHomePage: Searching for 'Cypress Course' in course list");
        const parents = this.page.locator("//span[@class='absolute inset-0']/..");
        const count = await parents.count();
        
        logger.step(`🏢 TenantHomePage: Found ${count} course items to search through`);

        for (let i = 0; i < count; i++) {
            const text = await parents.nth(i).innerText();
            logger.debug(`🏢 TenantHomePage: Checking course item ${i + 1}: ${text}`);
                expect(text.includes('Cypress Course'));
                logger.step("🏢 TenantHomePage: Finding the course correctly on tenant");
                break;
        }
        
    }
}
