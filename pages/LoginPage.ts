import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import allLocators from '../locators/loginLocator.json';
import { logger } from "../utilities/loggers";

export class LoginPage extends BasePage {
    page: Page;
    
    constructor(page: Page) {
        super(page);
        this.page = page;
    }

    async goToLogin() {
        await this.navigateTo("/");
        logger.step("🔐 LoginPage: Successfully navigated to login page");
    }

    // extract locators from JSON file
    private locators = allLocators.loginpage;
    private usernameInput = () => this.page.locator(this.locators.usernameInput);
    private passwordInput = () => this.page.locator(this.locators.passwordInput);
    private submitButton = () => this.page.locator("//button[@type='submit']");

    //@param username: string
    //@param password: string
    //@description: login to the application with username and password
    //@returns: void
    async login(username: string, password: string) {
        logger.step(`🔐 LoginPage: Starting login process for user: ${username}`);
        
        logger.step(`🔐 LoginPage: Filling username: ${username}`);
        await this.fillInput(this.usernameInput(), username);
        
        logger.step("🔐 LoginPage: Filling password field");
        await this.fillInput(this.passwordInput(), password);
        
        logger.step("🔐 LoginPage: Clicking submit button");
        await this.click(this.submitButton());
        
        logger.step(`🔐 LoginPage: Login process completed for user: ${username}`);
    }
}
