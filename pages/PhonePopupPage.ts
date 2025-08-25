import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { logger } from "../utilities/loggers";

export class PhonePopupPage extends BasePage {
    page: Page;
    
    constructor(page: Page) {
        super(page);
        this.page = page;
    }

    private addPhoneLatterButton = () => this.page.locator("//div[contains(@class, 'flex-col')]/button[2]");

    //@description: add phone later 
    //@returns: void
    async addPhoneLater() {
        logger.step("PhonePopupPage: Clicking 'Add Phone Later' button");
        await this.click(this.addPhoneLatterButton())
        logger.step("PhonePopupPage: Successfully clicked 'Add Phone Later' button");
    }
}
