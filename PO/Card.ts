import { Page, Locator } from '@playwright/test';

export class Card {
  readonly page: Page;
  readonly cardElement: Locator;

  //Constructor for the card class.
  constructor(page: Page, cardElement: Locator) {
    this.page = page;
    this.cardElement = cardElement;
  }

  //Get the text of the subtasks.
  async getSubtasksText(): Promise<string> {
    return await this.cardElement.locator('p.text-xs.text-medium-grey.font-bold.select-none').innerText();
  }

  //Get the name of the card.
  async getName(): Promise<string> {
    return await this.cardElement.locator('h3').innerText();
  }

  //Click on the card.
  async click() {
    await this.cardElement.click();
  }

  //Complete the first subtask of the card.
  async completeFirstSubtask(): Promise<string> {
    const subtaskText = this.page.locator('//*[@class="text-black dark:text-white text-xs font-bold"]').first();
    const subtaskTextContent = await subtaskText.textContent();
    await subtaskText.click();
    console.log('The subtask with name ' + subtaskTextContent + ' has been checked.');
    return subtaskTextContent!;
  }

  //Move the card to the first column.
  async moveToFirstColumn() {
    const moveToFirstColumnElement = this.page.locator('//*[@class="text-sm text-black dark:text-white font-bold rounded px-4 py-3 relative w-full flex items-center border border-medium-grey border-opacity-25 cursor-pointer hover:border-main-purple focus:border-main-purple group"]');
    await moveToFirstColumnElement.click();
    await this.page.waitForTimeout(1000);
    const firstOption = this.page.locator('//*[contains(@class, "p-4 text-medium-grey")]').first();
    await firstOption.click();
  }
  
  //Check if a subtask is marked as strikethrough.
  async isStrikethrough(subtaskTextContent: string): Promise<boolean> {
    const lineThroughElements = this.page.locator('//*[contains(@class, "line-through")]');
    const lineThroughElementsText = await lineThroughElements.evaluateAll(elements => {
      return elements.map(element => element.textContent);
    });
    return lineThroughElementsText.some(text => text!.trim() === subtaskTextContent.trim());
  }
}
