import { Page, Locator, expect } from '@playwright/test';

export class KanbanPage {
  readonly page: Page;
  readonly url: string;
  readonly firstColumn: Locator;
  readonly darkModeToggle: Locator;

  //Constructor for the KanbanPage class.
  constructor(page: Page) {
    this.page = page;
    this.url = 'https://kanban-566d8.firebaseapp.com/';
    this.firstColumn = page.locator('//*[@class="min-w-[280px] last:pr-6 box-content"][1]/div[2]');
    this.darkModeToggle = page.locator('label div');
  }

  //Going to Kanban App.
  async goto() {
    await this.page.goto(this.url);
    console.log('Open Kanban app.');
  }

  //Get a specific comun based on the colum number.
  async getColumn(columnNumber: number): Promise<Locator> {
    return this.page.locator(`//*[@class="min-w-[280px] last:pr-6 box-content"][${columnNumber}]/div[2]/article`);
  }

  //Toogle the dark mode.
  async toggleDarkMode() {
    await this.darkModeToggle.click();
    console.log('This clicks on the toggle to be on dark mode.');
  }

  //Check if dark mode is enabled.
  async isDarkModeEnabled(): Promise<boolean> {
    const isDarkMode = await this.page.evaluate(() => {
      return document.documentElement.classList.contains('dark');
    });
    return isDarkMode;
  }
  
  //Check if the dark mode toggle has moved correctly.
  async isDarkModeToggleMoved(): Promise<boolean> {
    const divTranslated = await this.darkModeToggle.evaluate((div: HTMLElement) => {
      return div.classList.contains('translate-x-[18px]');
    });
    return divTranslated;
  }
}
