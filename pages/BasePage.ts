import { Page, Locator, expect } from "@playwright/test";
import { logger } from "../utilities/loggers";

// Common options interface for element interactions
export interface ElementOptions {
    timeout?: number;
    force?: boolean;
    delay?: number;
    retries?: number;
}

// Wait options interface
export interface WaitOptions {
    timeout?: number;
    state?: 'attached' | 'detached' | 'visible' | 'hidden';
}

// Navigation options interface
export interface NavigationOptions {
    timeout?: number;
    waitUntil?: 'load' | 'domcontentloaded' | 'networkidle';
}

// Keyboard options interface
export interface KeyboardOptions {
    delay?: number;
    timeout?: number;
}

// Drag and drop options interface
export interface DragDropOptions {
    timeout?: number;
    force?: boolean;
}

export class BasePage {
    protected page: Page;
    protected defaultTimeout: number = 10000;
    protected defaultRetries: number = 3;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Generic method to wait for element to be in specified state
     * @param locator - The locator of the element
     * @param options - Wait options
     */
    async waitForElement(locator: Locator, options: WaitOptions = {}): Promise<void> {
        const timeout = options.timeout ?? this.defaultTimeout;
        const state = options.state ?? 'visible';
        
        try {
            await locator.waitFor({ state, timeout });
        } catch (error) {
            throw new Error(`Element not in ${state} state within ${timeout}ms: ${error}`);
        }
    }

    /**
     * Generic method to check if element is enabled and interactable
     * @param locator - The locator of the element
     * @param force - Whether to force the action
     */
    private async checkElementInteractability(locator: Locator, force: boolean = false): Promise<void> {
        if (!force) {
            const isEnabled = await locator.isEnabled();
            if (!isEnabled) {
                throw new Error('Element is not enabled or interactable');
            }
        }
    }
    /**
     * Check if an element is visible
     * @param locator - Playwright Locator of the element
     * @returns Promise<boolean> - true if visible, false otherwise
     */
    async isElementVisible(locator: Locator): Promise<boolean> {
        try {
        return await locator.isVisible();
        } catch (error) {
        return false;
        }
    }
    /**
     * Check if an element is enabale
     * @param locator - Playwright Locator of the element
     * @returns Promise<boolean> - true if enabale, false otherwise
     */
    async isElementEnabale(locator: Locator): Promise<boolean> {
        try {
        return await locator.isEnabled();
        } catch (error) {
        return false;
        }
    }
  

    /**
     * Enhanced click method with retry mechanism and better error handling
     * @param locator - The locator of the element to be clicked
     * @param options - Click options
     */
    async click(locator: Locator, options: ElementOptions = {}): Promise<void> {
        const elementDescription = await this.getElementDescription(locator);
        const timeout = options.timeout ?? this.defaultTimeout;
        const force = options.force ?? false;
        const delay = options.delay ?? 0;
        const retries = options.retries ?? this.defaultRetries;

        logger.pageAction('Click', elementDescription);

        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                await this.waitForElement(locator, { timeout, state: 'visible' });
                await this.waitForElement(locator, { timeout, state: 'attached' });
                await this.checkElementInteractability(locator, force);

                await locator.click({
                    force,
                    delay,
                    timeout
                });
                
                logger.info(`Successfully clicked element: ${elementDescription}`);
                return; // Success, exit retry loop
            } catch (error) {
                if (attempt === retries) {
                    logger.error(`Failed to click element after ${retries} attempts: ${elementDescription}`, { error: String(error) });
                    throw new Error(`Failed to click element after ${retries} attempts: ${error}`);
                }
                logger.warn(`Click attempt ${attempt} failed, retrying... ${elementDescription}`);
                await this.waitForTimeoutInSeconds(3); 
            }
        }
    }

    /**
     * Double click method with enhanced logging
     * @param locator - The locator of the element to double click
     * @param options - Double click options
     */
    async doubleClick(locator: Locator, options: ElementOptions = {}): Promise<void> {
        const elementDescription = await this.getElementDescription(locator);
        const timeout = options.timeout ?? this.defaultTimeout;
        const force = options.force ?? false;
        const delay = options.delay ?? 0;

        logger.pageAction('Double click', elementDescription);

        try {
            await this.waitForElement(locator, { timeout, state: 'visible' });
            await this.waitForElement(locator, { timeout, state: 'attached' });
            await this.checkElementInteractability(locator, force);

            await locator.dblclick({
                force,
                delay,
                timeout
            });
            
            logger.info(`Successfully double-clicked element: ${elementDescription}`);
        } catch (error) {
            logger.error(`Failed to double-click element: ${elementDescription}`, { error: String(error) });
            throw new Error(`Error double-clicking element: ${error}`);
        }
    }

    /**
     * Right click method with enhanced logging
     * @param locator - The locator of the element to right click
     * @param options - Right click options
     */
    async rightClick(locator: Locator, options: ElementOptions = {}): Promise<void> {
        const elementDescription = await this.getElementDescription(locator);
        const timeout = options.timeout ?? this.defaultTimeout;
        const force = options.force ?? false;
        const delay = options.delay ?? 0;

        logger.pageAction('Right click', elementDescription);

        try {
            await this.waitForElement(locator, { timeout, state: 'visible' });
            await this.waitForElement(locator, { timeout, state: 'attached' });
            await this.checkElementInteractability(locator, force);

            await locator.click({
                button: 'right',
                force,
                delay,
                timeout
            });
            
            logger.info(`Successfully right-clicked element: ${elementDescription}`);
        } catch (error) {
            logger.error(`Failed to right-click element: ${elementDescription}`, { error: String(error) });
            throw new Error(`Error right-clicking element: ${error}`);
        }
    }

    /**
     * clear method with clearing strategy 
     * @param locator - The locator of the element to clear
     * @param options - Clear options
     */
    async clear(locator: Locator, options: ElementOptions = {}): Promise<void> {
        const elementDescription = await this.getElementDescription(locator);
        const timeout = options.timeout ?? this.defaultTimeout;
        
        logger.pageAction('Clear input', elementDescription);
        
        try {
            await this.waitForElement(locator, { timeout, state: 'visible' });
            await this.click(locator, options);
            
            await locator.clear({ timeout });
            logger.debug(`Cleared input: ${elementDescription}`);
            
            const value = await locator.inputValue();
            if (value) {
                // Fallback: use keyboard shortcuts
                await this.page.keyboard.press('Control+a');
                await this.page.keyboard.press('Delete');
                logger.debug(`Cleared input using keyboard fallback: ${elementDescription}`);

                const finalValue = await locator.inputValue();
                if (finalValue) {
                    throw new Error(`Failed to clear input, value still present: "${finalValue}"`);
                }
            }
            
            logger.info(`Successfully cleared input: ${elementDescription}`);
        } catch (error) {
            logger.error(`Error clearing element: ${elementDescription}`, { error: String(error) });
            throw new Error(`Error clearing element: ${error}`);
        }
    }

    /**
     * @description: get element description for logging 
     * @param locator - The locator of the element to get the description for
     * @returns: string - The description of the element
     */
    private async getElementDescription(locator: Locator): Promise<string> {
        try {
            const tagName = await locator.evaluate(el => el.tagName.toLowerCase());
            const id = await locator.getAttribute('id');
            const className = await locator.getAttribute('class');
            const dataTestId = await locator.getAttribute('data-testid');
            
            if (dataTestId) return `${tagName}[data-testid="${dataTestId}"]`;
            if (id) return `${tagName}#${id}`;
            if (className) return `${tagName}.${className.split(' ')[0]}`;
            return tagName;
        } catch {
            return 'unknown element';
        }
    }

    /**
     * Enhanced fill method with retry mechanism and validation
     * @param locator - The locator of the input element to fill
     * @param value - The text value to enter
     * @param options - Fill options
     */
    async fillInput(locator: Locator, text: string, timeout: number = 10000): Promise<void> {
        const elementDescription = await this.getElementDescription(locator);
        logger.pageAction('Fill input', `${elementDescription} with "${text}"`);
        
        try {
            await locator.waitFor({ state: 'visible', timeout });
            await this.clear(locator);
            await locator.fill(text);
            logger.info(`Filled input: ${elementDescription} with "${text}"`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger.error(`Failed to fill input: ${elementDescription} with "${text}"`, { error: errorMessage });
            throw error;
        }
    }

    /**
     * Enhanced hover method
     * @param locator - The locator of the element to hover over
     * @param options - Hover options
     */
    async hover(locator: Locator, options: ElementOptions = {}): Promise<void> {
        const elementDescription = await this.getElementDescription(locator);
        const timeout = options.timeout ?? this.defaultTimeout;
        const force = options.force ?? false;

        logger.pageAction('Hover', elementDescription);

        try {
            await this.waitForElement(locator, { timeout, state: 'visible' });
            await this.waitForElement(locator, { timeout, state: 'attached' });
            await this.checkElementInteractability(locator, force);
            
            await locator.hover({ timeout });
            logger.info(`Successfully hovered over element: ${elementDescription}`);
        } catch (error) {
            logger.error(`Error hovering over element: ${elementDescription}`, { error: String(error) });
            throw new Error(`Error hovering over element: ${error}`);
        }
    }

    /**
     * Enhanced select option from dropdown/select element with logging
     * @param locator - The locator of the select element
     * @param value - The value to select
     * @param options - Select options
     */
    async selectOption(locator: Locator, value: string | string[], options: ElementOptions = {}): Promise<void> {
        const elementDescription = await this.getElementDescription(locator);
        const timeout = options.timeout ?? this.defaultTimeout;
        const force = options.force ?? false;

        logger.pageAction('Select option', `${elementDescription} with value: ${Array.isArray(value) ? value.join(', ') : value}`);

        try {
            await this.waitForElement(locator, { timeout, state: 'visible' });
            await this.checkElementInteractability(locator, force);
            
            await locator.selectOption(value, { timeout });
            logger.info(`Successfully selected option in: ${elementDescription} with value: ${Array.isArray(value) ? value.join(', ') : value}`);
        } catch (error) {
            logger.error(`Error selecting option in: ${elementDescription}`, { error: String(error) });
            throw new Error(`Error selecting option: ${error}`);
        }
    }

    /**
     * Select option by visible text from dropdown
     * @param locator - The locator of the select element
     * @param text - The visible text to select
     * @param options - Select options
     */
    async selectOptionByText(locator: Locator, text: string, options: ElementOptions = {}): Promise<void> {
        const elementDescription = await this.getElementDescription(locator);
        const timeout = options.timeout ?? this.defaultTimeout;
        const force = options.force ?? false;

        logger.pageAction('Select option by text', `${elementDescription} with text: "${text}"`);

        try {
            await this.waitForElement(locator, { timeout, state: 'visible' });
            await this.checkElementInteractability(locator, force);
            
            await locator.selectOption({ label: text }, { timeout });
            logger.info(`Successfully selected option by text in: ${elementDescription} with text: "${text}"`);
        } catch (error) {
            logger.error(`Error selecting option by text in: ${elementDescription}`, { error: String(error) });
            throw new Error(`Error selecting option by text: ${error}`);
        }
    }

    /**
     * Check or uncheck a checkbox
     * @param locator - The locator of the checkbox
     * @param check - Whether to check (true) or uncheck (false)
     * @param options - Check options
     */
    async setChecked(locator: Locator, check: boolean, options: ElementOptions = {}): Promise<void> {
        const elementDescription = await this.getElementDescription(locator);
        const timeout = options.timeout ?? this.defaultTimeout;
        const force = options.force ?? false;

        logger.pageAction('Set checkbox', `${elementDescription} to ${check ? 'checked' : 'unchecked'}`);

        try {
            await this.waitForElement(locator, { timeout, state: 'visible' });
            await this.checkElementInteractability(locator, force);
            
            await locator.setChecked(check, { timeout });
            logger.info(`Successfully set checkbox: ${elementDescription} to ${check ? 'checked' : 'unchecked'}`);
        } catch (error) {
            logger.error(`Error setting checkbox state: ${elementDescription}`, { error: String(error) });
            throw new Error(`Error setting checkbox state: ${error}`);
        }
    }

    /**
     * Get text content of an element
     * @param locator - The locator of the element
     * @param options - Get text options
     */
    async getText(locator: Locator, options: ElementOptions = {}): Promise<string> {
        const elementDescription = await this.getElementDescription(locator);
        const timeout = options.timeout ?? this.defaultTimeout;

        logger.pageAction('Get text', elementDescription);

        try {
            await this.waitForElement(locator, { timeout, state: 'visible' });
            const text = await locator.textContent() ?? '';
            logger.debug(`Retrieved text from: ${elementDescription}`, { text });
            return text;
        } catch (error) {
            logger.error(`Error getting text content: ${elementDescription}`, { error: String(error) });
            throw new Error(`Error getting text content: ${error}`);
        }
    }

    /**
     * Get attribute value of an element
     * @param locator - The locator of the element
     * @param attribute - The attribute name
     * @param options - Get attribute options
     */
    async getAttribute(locator: Locator, attribute: string, options: ElementOptions = {}): Promise<string | null> {
        const elementDescription = await this.getElementDescription(locator);
        const timeout = options.timeout ?? this.defaultTimeout;

        logger.pageAction('Get attribute', `${elementDescription} attribute: ${attribute}`);

        try {
            await this.waitForElement(locator, { timeout, state: 'visible' });
            const value = await locator.getAttribute(attribute);
            logger.debug(`Retrieved attribute from: ${elementDescription}`, { attribute, value });
            return value;
        } catch (error) {
            logger.error(`Error getting attribute ${attribute} from: ${elementDescription}`, { error: String(error) });
            throw new Error(`Error getting attribute ${attribute}: ${error}`);
        }
    }

    /**
     * Check if element is visible
     * @param locator - The locator of the element
     * @param options - Visibility check options
     */
    async isVisible(locator: Locator, options: ElementOptions = {}): Promise<boolean> {
        const elementDescription = await this.getElementDescription(locator);
        const timeout = options.timeout ?? this.defaultTimeout;

        logger.pageAction('Check visibility', elementDescription);

        try {
            await this.waitForElement(locator, { timeout, state: 'visible' });
            const visible = await locator.isVisible();
            logger.debug(`Visibility check for: ${elementDescription}`, { visible });
            return visible;
        } catch (error) {
            logger.debug(`Element not visible: ${elementDescription}`, { error: String(error) });
            return false;
        }
    }

    /**
     * Wait for element to disappear
     * @param locator - The locator of the element
     * @param options - Wait options
     */
    async waitForElementToDisappear(locator: Locator, options: WaitOptions = {}): Promise<void> {
        const elementDescription = await this.getElementDescription(locator);
        const timeout = options.timeout ?? this.defaultTimeout;

        logger.pageAction('Wait for element to disappear', elementDescription);

        try {
            await locator.waitFor({ state: 'hidden', timeout });
            logger.info(`Element disappeared: ${elementDescription}`);
        } catch (error) {
            logger.error(`Element did not disappear within ${timeout}ms: ${elementDescription}`, { error: String(error) });
            throw new Error(`Element did not disappear within ${timeout}ms: ${error}`);
        }
    }

    /**
     * Enhanced keyboard actions with logging
     * @param key - The key to press
     * @param options - Keyboard options
     */
    async pressKey(key: string, options: KeyboardOptions = {}): Promise<void> {
        const delay = options.delay ?? 0;
        const timeout = options.timeout ?? this.defaultTimeout;

        logger.pageAction('Press key', key);

        try {
            await this.page.keyboard.press(key, { delay });
            logger.info(`Successfully pressed key: ${key}`);
        } catch (error) {
            logger.error(`Error pressing key: ${key}`, { error: String(error) });
            throw new Error(`Error pressing key: ${key}: ${error}`);
        }
    }

    /**
     * Type text with keyboard
     * @param text - The text to type
     * @param options - Keyboard options
     */
    async typeText(text: string, options: KeyboardOptions = {}): Promise<void> {
        const delay = options.delay ?? 0;
        const timeout = options.timeout ?? this.defaultTimeout;

        logger.pageAction('Type text', `"${text}"`);

        try {
            await this.page.keyboard.type(text, { delay });
            logger.info(`Successfully typed text: "${text}"`);
        } catch (error) {
            logger.error(`Error typing text: "${text}"`, { error: String(error) });
            throw new Error(`Error typing text: "${text}": ${error}`);
        }
    }

    /**
     * Drag and drop functionality
     * @param source - The source element to drag
     * @param target - The target element to drop on
     * @param options - Drag and drop options
     */
    async dragAndDrop(source: Locator, target: Locator, options: DragDropOptions = {}): Promise<void> {
        const sourceDescription = await this.getElementDescription(source);
        const targetDescription = await this.getElementDescription(target);
        const timeout = options.timeout ?? this.defaultTimeout;
        const force = options.force ?? false;

        logger.pageAction('Drag and drop', `from ${sourceDescription} to ${targetDescription}`);

        try {
            await this.waitForElement(source, { timeout, state: 'visible' });
            await this.waitForElement(target, { timeout, state: 'visible' });
            
            await source.dragTo(target, { timeout, force });
            logger.info(`Successfully dragged from ${sourceDescription} to ${targetDescription}`);
        } catch (error) {
            logger.error(`Error in drag and drop from ${sourceDescription} to ${targetDescription}`, { error: String(error) });
            throw new Error(`Error in drag and drop: ${error}`);
        }
    }

    /**
     * Enhanced alert handling with logging
     * @param action - The action to perform on the alert
     * @param promptText - Text to enter for prompt dialogs
     */
    async handleAlert(action: 'accept' | 'dismiss' | 'fill', promptText?: string): Promise<void> {
        logger.pageAction('Handle alert', `Action: ${action}${promptText ? `, Text: "${promptText}"` : ''}`);

        try {
            this.page.on('dialog', dialog => {
                switch (action) {
                    case 'accept':
                        if (promptText) {
                            dialog.accept(promptText);
                        } else {
                            dialog.accept();
                        }
                        break;
                    case 'dismiss':
                        dialog.dismiss();
                        break;
                    case 'fill':
                        dialog.accept(promptText || '');
                        break;
                }
            });
            
            logger.info(`Successfully set up alert handler for action: ${action}`);
        } catch (error) {
            logger.error(`Error setting up alert handler for action: ${action}`, { error: String(error) });
            throw new Error(`Error setting up alert handler: ${error}`);
        }
    }

    /**
     * Wait for and handle alert
     * @param action - The action to perform on the alert
     * @param promptText - Text to enter for prompt dialogs
     * @param timeout - Timeout for waiting for alert
     */
    async waitForAndHandleAlert(action: 'accept' | 'dismiss' | 'fill', promptText?: string, timeout: number = 5000): Promise<void> {
        logger.pageAction('Wait for and handle alert', `Action: ${action}${promptText ? `, Text: "${promptText}"` : ''}`);

        try {
            const dialogPromise = new Promise<void>((resolve) => {
                this.page.on('dialog', dialog => {
                    switch (action) {
                        case 'accept':
                            if (promptText) {
                                dialog.accept(promptText);
                            } else {
                                dialog.accept();
                            }
                            break;
                        case 'dismiss':
                            dialog.dismiss();
                            break;
                        case 'fill':
                            dialog.accept(promptText || '');
                            break;
                    }
                    resolve();
                });
            });

            await Promise.race([
                dialogPromise,
                this.waitForTimeoutInSeconds(timeout)
            ]);
            
            logger.info(`Successfully handled alert with action: ${action}`);
        } catch (error) {
            logger.error(`Error handling alert with action: ${action}`, { error: String(error) });
            throw new Error(`Error handling alert: ${error}`);
        }
    }

    /**
     * Navigate to URL with options (timeout and waitUntil)
     * @param url - The URL to navigate to
     * @param options - Navigation options
     */
    async navigateTo(url: string, options: NavigationOptions = {}): Promise<void> {
        logger.pageAction('Navigate to', url);
        const timeout = options.timeout ?? this.defaultTimeout;
        const waitUntil = options.waitUntil ?? 'domcontentloaded';

        try {
            await this.page.goto(url, { 
                timeout, 
                waitUntil 
            });
            logger.info(`Successfully navigated to: ${url}`);
        } catch (error) {
            logger.error(`Navigation failed to: ${url}`, { error: String(error) });
        }
    }

    /**
     * Wait for page to load completely 
     * @param options - Wait options
     */
    async waitForPageLoad(options: NavigationOptions = {}): Promise<void> {
        const timeout = options.timeout ?? this.defaultTimeout;
        const waitUntil = options.waitUntil ?? 'networkidle';

        logger.pageAction('Wait for page load', `State: ${waitUntil}`);

        try {
            await this.page.waitForLoadState(waitUntil, { timeout });
            logger.info(`Page loaded successfully with state: ${waitUntil}`);
        } catch (error) {
            logger.error(`Page load wait failed with state: ${waitUntil}`, { error: String(error) });
            throw new Error(`Page load wait failed: ${error}`);
        }
    }

    /**
     * Scroll element into view
     * @param locator - The locator of the element
     * @param options - Scroll options
     */
    async scrollIntoView(locator: Locator, options: ElementOptions = {}): Promise<void> {
        const elementDescription = await this.getElementDescription(locator);
        const timeout = options.timeout ?? this.defaultTimeout;

        logger.pageAction('Scroll into view', elementDescription);

        try {
            await this.waitForElement(locator, { timeout, state: 'attached' });
            await locator.scrollIntoViewIfNeeded({ timeout });
            logger.info(`Successfully scrolled element into view: ${elementDescription}`);
        } catch (error) {
            logger.error(`Error scrolling element into view: ${elementDescription}`, { error: String(error) });
            throw new Error(`Error scrolling element into view: ${error}`);
        }
    }

    /**
     * Wait for specific timeout 
     * @param timeout - Time to wait in milliseconds
     */
    async waitForTimeoutInSeconds(timeout: number): Promise<void> {
        logger.debug(`Waiting for timeout: ${timeout}ms`);
        return new Promise((resolve) => setTimeout(resolve, timeout * 1000));
    }

    /**
     * Get current URL
     */
    async getCurrentUrl(): Promise<string> {
        const url = this.page.url();
        logger.debug(`Current URL: ${url}`);
        return url;
    }

    /**
     * Get page title
     */
    async getPageTitle(): Promise<string> {
        const title = this.page.title();
        logger.debug(`Page title: ${title}`);
        return title;
    }

    /**
     * Reload page
     * @param options - Reload options
     */
    async reloadPage(options: NavigationOptions = {}): Promise<void> {
        const timeout = options.timeout ?? this.defaultTimeout;
        const waitUntil = options.waitUntil ?? 'networkidle';

        logger.pageAction('Reload page', `Wait until: ${waitUntil}`);

        try {
            await this.page.reload({ timeout, waitUntil });
            logger.info(`Page reloaded successfully`);
        } catch (error) {
            logger.error(`Page reload failed`, { error: String(error) });
            throw new Error(`Page reload failed: ${error}`);
        }
    }

    /**
     * Go back in browser history
     * @param options - Navigation options
     */
    async goBack(options: NavigationOptions = {}): Promise<void> {
        const timeout = options.timeout ?? this.defaultTimeout;
        const waitUntil = options.waitUntil ?? 'networkidle';

        logger.pageAction('Go back', `Wait until: ${waitUntil}`);

        try {
            await this.page.goBack({ timeout, waitUntil });
            logger.info(`Successfully went back in browser history`);
        } catch (error) {
            logger.error(`Go back failed`, { error: String(error) });
            throw new Error(`Go back failed: ${error}`);
        }
    }

    /**
     * Go forward in browser history
     * @param options - Navigation options
     */
    async goForward(options: NavigationOptions = {}): Promise<void> {
        const timeout = options.timeout ?? this.defaultTimeout;
        const waitUntil = options.waitUntil ?? 'networkidle';

        logger.pageAction('Go forward', `Wait until: ${waitUntil}`);

        try {
            await this.page.goForward({ timeout, waitUntil });
            logger.info(`Successfully went forward in browser history`);
        } catch (error) {
            logger.error(`Go forward failed`, { error: String(error) });
            throw new Error(`Go forward failed: ${error}`);
        }
    }

    /**
     * Open URL in a new tab
     * @param url - The URL to open in new tab
     * @param options - Options for opening the new tab
     * @param options.timeout - Maximum time to wait for new page to load
     * @param options.waitUntil - When to consider navigation succeeded
     * @returns Promise<Page> - The new page object
     */
    async openInNewTab(url: string, options: { 
        timeout?: number; 
        waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' 
    } = {}): Promise<Page> {
        const timeout = options.timeout ?? this.defaultTimeout;
        const waitUntil = options.waitUntil ?? 'networkidle';

        logger.pageAction('Open in new tab', url);

        try {
            // Create a new page context
            const newPage = await this.page.context().newPage();
            
            // Navigate to the URL in the new tab
            await newPage.goto(url, { 
                timeout, 
                waitUntil 
            });

            logger.info(`Successfully opened ${url} in new tab`);
            return newPage;
        } catch (error) {
            logger.error(`Failed to open ${url} in new tab`, { error: String(error) });
            throw new Error(`Failed to open ${url} in new tab: ${error}`);
        }
    }

    /**
     * Open URL in a new tab and switch to it (timeout and waitUntil)
     * @param url - The URL to open in new tab
     * @param options - Options for opening the new tab
     * @param options.timeout - Maximum time to wait for new page to load
     * @param options.waitUntil - When to consider navigation succeeded
     * @returns Promise<Page> - The new page object
     */
    async openInNewTabAndSwitch(url: string, options: { 
        timeout?: number; 
        waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' 
    } = {}): Promise<Page> {
        logger.pageAction('Open in new tab and switch', url);

        try {
            const newPage = await this.openInNewTab(url, options);
            
            // Switch to the new page
            this.page = newPage;
            
            logger.info(`Successfully switched to new tab with URL: ${url}`);
            return newPage;
        } catch (error) {
            logger.error(`Failed to open and switch to new tab: ${url}`, { error: String(error) });
            throw new Error(`Failed to open and switch to new tab: ${url}: ${error}`);
        }
    }

    /**
     * Get all open pages in the current context
     * @returns Promise<Page[]> - Array of all open pages
     */
    async getAllPages(): Promise<Page[]> {
        const pages = this.page.context().pages();
        logger.debug(`Retrieved ${pages.length} open pages`);
        return pages;
    }

    /**
     * Switch to a specific page by index
     * @param pageIndex - Index of the page to switch to (0-based)
     * @returns Promise<Page> - The page that was switched to
     */
    async switchToPage(pageIndex: number): Promise<Page> {
        const pages = await this.getAllPages();
        
        if (pageIndex < 0 || pageIndex >= pages.length) {
            const error = `Page index ${pageIndex} is out of range. Available pages: ${pages.length}`;
            logger.error(`Failed to switch to page by index: ${pageIndex}`, { error });
            throw new Error(error);
        }

        this.page = pages[pageIndex];
        logger.info(`Successfully switched to page index: ${pageIndex}`);
        return this.page;
    }

    /**
     * Switch to a specific page by its title
     * @param tabName - The title of the page to switch to
     * @returns Promise<Page> - The page that was switched to
     */
    async switchToPageByName(tabName: string): Promise<Page> {
        const pages = await this.getAllPages();
    
        for (const pg of pages) {
            const title = await pg.title();
            if (title.includes(tabName)) {
                this.page = pg;
                logger.info(`Successfully switched to page by name: "${tabName}"`);
                return this.page;
            }
        }
    
        const error = `No page found with title containing "${tabName}". Available pages: ${pages.length}`;
        logger.error(`Failed to switch to page by name: "${tabName}"`, { error });
        throw new Error(error);
    }

    /**
     * Switch to a specific page by URL pattern
     * @param urlPattern - URL pattern to match (string or RegExp)
     * @returns Promise<Page> - The page that was switched to
     */
    async switchToPageByUrl(urlPattern: string | RegExp): Promise<Page> {
        const pages = await this.getAllPages();
        
        for (const page of pages) {
            const pageUrl = page.url();
            if (typeof urlPattern === 'string') {
                if (pageUrl.includes(urlPattern)) {
                    this.page = page;
                    logger.info(`Successfully switched to page by URL pattern: "${urlPattern}"`);
                    return page;
                }
            } else {
                if (urlPattern.test(pageUrl)) {
                    this.page = page;
                    logger.info(`Successfully switched to page by URL pattern: ${urlPattern}`);
                    return page;
                }
            }
        }
        
        const error = `No page found matching URL pattern: ${urlPattern}`;
        logger.error(`Failed to switch to page by URL pattern: ${urlPattern}`, { error });
        throw new Error(error);
    }

    /**
     * Close a specific page by index
     * @param pageIndex - Index of the page to close (0-based)
     * @param options - Options for closing
     * @param options.switchToMain - Whether to switch back to the main page after closing
     */
    async closePage(pageIndex: number, options: { switchToMain?: boolean } = {}): Promise<void> {
        const pages = await this.getAllPages();
        
        if (pageIndex < 0 || pageIndex >= pages.length) {
            const error = `Page index ${pageIndex} is out of range. Available pages: ${pages.length}`;
            logger.error(`Failed to close page by index: ${pageIndex}`, { error });
            throw new Error(error);
        }

        const pageToClose = pages[pageIndex];
        
        // If we're closing the current page, switch to main page first
        if (pageToClose === this.page && options.switchToMain !== false) {
            await this.switchToPage(0); // Switch to main page
        }
        
        await pageToClose.close();
        logger.info(`Successfully closed page index: ${pageIndex}`);
    }

    /**
     * Close all pages except the main page
     */
    async closeAllPagesExceptMain(): Promise<void> {
        const pages = await this.getAllPages();
        
        // Close all pages except the first one (main page)
        for (let i = 1; i < pages.length; i++) {
            await pages[i].close();
        }
        
        // Switch back to main page
        if (pages.length > 0) {
            this.page = pages[0];
        }
        
        logger.info(`Successfully closed all pages except main page`);
    }
}