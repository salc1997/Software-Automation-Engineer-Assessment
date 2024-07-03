import { Locator } from "@playwright/test";

export const kanbanSelectors = {
  board: 'div.flex section',
  boardColumnsContainer: '//div[@class="flex"]',
  firstColumn: '//div[@class="flex"]/div/section[1]',
  firstColumnTitle: '//div[@class="flex"]/div/section[1]/div/h2',
  lastColumn: '//div[@class="flex"]/div/section[4]',
  lastColumnTitle: '//div[@class="flex"]/div/section[4]/div/h2',
  lastColumnCardsContainer: '//div[@class="flex"]/div/section[4]/div[2]',
  lastColumnCardsArticles: 'div.flex > div > section:nth-child(4) > div:nth-child(2) > article',
  lastColumnCardIncompleted: '//div[@class="flex"]/div/section[4]/div[2]/article',
  cardModalSubtasksContainer: 'div.flex.flex-col.gap-2 > label',
  subtaskToComplete: '//div[@class="flex flex-col gap-2"]',
  closeModal: '//div[@id="app"]',
  modalMenuButton: '//div[@class="flex justify-between items-center gap-4"]/div',
  deleteOption: '//p[text()="Delete Task"]',
  deleteButton: '//button[text()="Delete"]',
  toggleDarkModeButton: '//div[@class="flex flex-col gap-2 mt-auto"]/div/label/div',
};
