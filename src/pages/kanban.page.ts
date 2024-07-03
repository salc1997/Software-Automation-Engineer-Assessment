import { Locator, Response, expect } from '@playwright/test';
import { Page } from 'playwright';
import { kanbanSelectors } from '../selectors';
import { ColumnsInfo } from '../interfaces/columns-info.interface';

class KanbanPage {
  private page: Page;
  private TIME_TO_AWAIT: number;

  constructor(page: Page) {
    this.page = page;
    this.TIME_TO_AWAIT = 1000;
  }

  async goto(): Promise<null | Response> {
    return this.page.goto('/');
  }

  private async getCountBoardsColumns() {
    const boardSelector = kanbanSelectors.board;
    return this.page.evaluate((selector) => {
      const board = document.querySelectorAll(selector);
      return board.length;
    }, boardSelector);
  }

  async waitForColumnsToBeFour() {
    const columns = await this.getCountBoardsColumns();
    if (columns < 4) {
      await this.page.reload();
      await this.page.waitForTimeout(this.TIME_TO_AWAIT);
      return this.waitForColumnsToBeFour();
    }
  }

  async checkBoard() {
    return this.waitForColumnsToBeFour();
  }

  async getIncompleteCard() {
    const cardsArticlesSelector = kanbanSelectors.lastColumnCardsArticles;

    return this.page.evaluate((selector) => {
      const cardsArticles = document.querySelectorAll(selector);
      const cardsArticleArray = Array.from(cardsArticles);

      const cardIndex = cardsArticleArray.findIndex((card) => {
        const text = card.querySelector('p')?.textContent;
        const texts = text?.split(' ') || [];
        const completed = texts[0];
        const total = texts[2];

        return completed < total
      });

      return cardIndex + 1;
    }, cardsArticlesSelector);
  }

  async clickOnCardWithTaskIncompleted(index: number) {
    const cardLocator = this.page.locator(`${kanbanSelectors.lastColumnCardIncompleted}[${index}]`);
    return cardLocator.click();
  }

  async selectIncompleteCard() {
    const cardTaskIncompletedIndex = await this.getIncompleteCard();
    if (!cardTaskIncompletedIndex) {
      return this.checkBoard();
    }
    return this.clickOnCardWithTaskIncompleted(cardTaskIncompletedIndex);
  }

  async clickOnSubtaskToComplete(index: number) {
    const subtaskLocator = this.page.locator(`${kanbanSelectors.subtaskToComplete}/label[${index}]`);
    return subtaskLocator.click();
  }

  async checkIfSubtaskIsCompleted(index: number) {
    const subtaskLocator = this.page.locator(`${kanbanSelectors.subtaskToComplete}/label[${index}]/div/input`);
    return subtaskLocator.isChecked();
  }

  async getTaskToComplete() {
    const subtasksContainerSelector = kanbanSelectors.cardModalSubtasksContainer;
    const subtaskIndex = await this.page.evaluate((selector) => {
      const subtasksSelector = document.querySelectorAll(selector);
      const subtasksLabelArray = Array.from(subtasksSelector);

      const subtaskIndex = subtasksLabelArray.findIndex((subtask) => {
        const checkbox = subtask.querySelector('div > input[type="checkbox"]');
        return checkbox && !checkbox.checked;
      });

      return subtaskIndex + 1;
    }, subtasksContainerSelector);
    return subtaskIndex;
  }

  async markTaskAsCompletedAndCheckIfWasCompleted() {
    const subtaskIndexToComplete = await this.getTaskToComplete();
    console.log('SUB TASK: ', subtaskIndexToComplete);
    await this.clickOnSubtaskToComplete(subtaskIndexToComplete);
    return this.checkIfSubtaskIsCompleted(subtaskIndexToComplete);
  }

  async getTilteAndTotalTasks(locator: string) {
    const infoColumnTitleSelector = await this.page.locator(locator).textContent();
    const infoColumnInfo = infoColumnTitleSelector?.split(' ') || [];
    return {
      title: infoColumnInfo[0],
      totalTasks: Number(infoColumnInfo[2]),
    };
  }

  async getColumnsInfo() {
    const firstColumnInfo = await this.getTilteAndTotalTasks(kanbanSelectors.firstColumn);
    const lastColumnInfo = await this.getTilteAndTotalTasks(kanbanSelectors.lastColumn);

    return {
      firstColumnInfo,
      lastColumnInfo,
    }
  }

  async changeTaskStatus() {
    const columnsInfo = await this.getColumnsInfo();

    const statusSelector = this.page.locator(`//div[@value="${columnsInfo.lastColumnInfo.title}"]`);
    await statusSelector.click();
    const statusChangeValue = this.page.locator(`//div[text()="${columnsInfo.firstColumnInfo.title}"]`);
    await statusChangeValue.click();

    return {
      ...columnsInfo,
    }
  }

  async checkIfColumnsInfoWasChanged(oldColumnsInfo: ColumnsInfo) {
    const currentColumnsInfo = await this.getColumnsInfo();
    expect(currentColumnsInfo.firstColumnInfo.totalTasks).toBeGreaterThan(oldColumnsInfo.firstColumnInfo.totalTasks);
  }
  async closeModal() {
    return this.page.locator(kanbanSelectors.closeModal).click();
  }

  async executeTest1() {
    await this.checkBoard();
    await this.selectIncompleteCard();
    await this.markTaskAsCompletedAndCheckIfWasCompleted();
    const taskChagedInfo = await this.changeTaskStatus();
    await this.closeModal();
    await this.page.waitForTimeout(this.TIME_TO_AWAIT);
    await this.checkIfColumnsInfoWasChanged(taskChagedInfo);
  }

  async clickOn(locator: string) {
    const modalMenuButton = this.page.locator(locator);
    return modalMenuButton.click();
  }

  async executeTest2() {
    await this.checkBoard();
    const columnsInfoBeforeDelete = await this.getColumnsInfo();
    await this.clickOnCardWithTaskIncompleted(1);

    await this.clickOn(kanbanSelectors.modalMenuButton);
    await this.clickOn(kanbanSelectors.deleteOption);
    await this.clickOn(kanbanSelectors.deleteButton);

    const columnsInfoAfterDelete = await this.getColumnsInfo();
    expect(columnsInfoAfterDelete.lastColumnInfo.totalTasks).toBeLessThan(columnsInfoBeforeDelete.lastColumnInfo.totalTasks);
  }

  async executeTest3() {
    const toggleDarkModelLocator = kanbanSelectors.toggleDarkModeButton;
    await this.clickOn(toggleDarkModelLocator);

    const hasDarkMode = await this.page.evaluate(() => {
      return document.documentElement.classList.contains('dark');
    });

    expect(hasDarkMode).toBe(true);
  }
}

export default KanbanPage;
