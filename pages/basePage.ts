import { Page, expect } from "@playwright/test";

export class BasePage {

    protected readonly page: Page

    constructor(page:Page) {
        this.page = page;
    }

    async loadWeb(url: string) {
        await this.page.goto(url);
    }

    async clickOn(selector: string) {
        await this.page.click(selector);
    }

    async getElementList(selector: string){
        await this.page.locator(selector).all();
    }

    async clickAndDeleteAnElement(selector: string){
        await this.page.getByText(selector).click();
        await this.page.getByRole('button', { name: 'Delete' }).click();
    }         
    
}