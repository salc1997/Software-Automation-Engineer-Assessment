import { test, expect } from '@playwright/test';
import { KanbanPage } from '../PO/KanbanPage';
import { Card } from '../PO/Card';

test('Edit Kanban Card', async ({ page }) => {
  const kanbanPage = new KanbanPage(page);
  await kanbanPage.goto();

  let cardWithSubtasks: Card | undefined;
  let completedSubTasksBefore = 0;
  let completedTasks = 0;
  let columnNumber = 2;

  let column = await kanbanPage.getColumn(columnNumber);
  let cardCount = await column.count();

  // Check if column 2 has cards
  if (cardCount === 0) {
    console.log(`Column number 2 has no available cards.`);
    columnNumber = 3;
    column = await kanbanPage.getColumn(columnNumber);
    cardCount = await column.count();
    // Check if column 3 has cards
    if (cardCount === 0) {
      console.log(`Column number 2 and column number 3 have no available cards.`);
      return;
    }
  }

  // Find a card with incomplete subtasks.
  for (let i = 0; i < cardCount; i++) {
    const cardElement = column.nth(i);
    const card = new Card(page, cardElement);
    const subtasksText = await card.getSubtasksText();
    const [completed, total] = subtasksText.match(/\d+/g)!.map(Number);
    if (completed < total) {
      completedTasks = total;
      cardWithSubtasks = card;
      completedSubTasksBefore = completed;
      break;
    }
  }

  // Click on the card with incomplete subtasks.
  await cardWithSubtasks.click();

  const cardName = await cardWithSubtasks.getName();
  console.log(`Task with name: ${cardName} before checkboxing and moving has ${completedSubTasksBefore} of ${completedTasks} subtasks completed`);
  console.log('The task named ' + cardName + ' in column number ' + columnNumber + ' has been selected');

  const subtaskTextContent = await cardWithSubtasks.completeFirstSubtask();
  await page.waitForTimeout(1000);

  // Verify the subtask is marked as completed.
  await page.waitForSelector('//*[contains(@class, "line-through")]');
  const found = await cardWithSubtasks.isStrikethrough(subtaskTextContent);
  expect(found).toBe(true);

   // Move the card to the first column and click outside the box.
  await cardWithSubtasks.moveToFirstColumn();
  await page.waitForTimeout(1000);
  await page.mouse.click(0, 0);

  // Verify the card is in the first column
  const cardInFirstColumn = kanbanPage.firstColumn.locator('article', { hasText: cardName }).first();
  await expect(cardInFirstColumn).toBeVisible();
  console.log('The card with name: ' + cardName + ' is on the first column.');

  // Verify the updated subtask count
  const subtaskCount = await cardInFirstColumn.locator('p.text-xs.text-medium-grey.font-bold.select-none').innerText();
  expect(subtaskCount).toContain(`${completedSubTasksBefore + 1} of ${completedTasks} substasks`);
  console.log(`Task with name: ${cardName} after checkboxing and moving now has ${completedSubTasksBefore + 1} of ${completedTasks} subtasks completed`);
});

test('Delete First Kanban Card', async ({ page }) => {
  const kanbanPage = new KanbanPage(page);
  await kanbanPage.goto();

  const firstColumn = kanbanPage.firstColumn;

  const initialCardCount = await firstColumn.locator('article').count();
  if (initialCardCount === 0) {
    console.log('There are no cards available on the first column to be eliminated.');
    return;
  }

  // Select and delete the first card in the first column
  const firstCardElement = firstColumn.locator('article').first();
  const firstCard = new Card(page, firstCardElement);
  await firstCard.click();
  console.log('Click on the first card of the first column.');

  const cardName = await firstCard.getName();
  const optionsButton = page.locator('//*[@class="group cursor-pointer relative"]').nth(1);
  await optionsButton.click();
  console.log('Click on 3 dot option.');

  await page.waitForTimeout(1000);
  await page.getByText('Delete Task').click();
  console.log('Click on Delete Task option.');
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'Delete' }).click();
  console.log('Click on Delete button.');

  // Verify the card is no longer present
  const cardExists = await page.locator(`h3:has-text("${cardName}")`).count();
  await page.waitForTimeout(1000);
  expect(cardExists).toBe(0);
  console.log('This verifies the card is no longer present.');

  await page.waitForTimeout(1000);

  const finalCardCount = await firstColumn.locator('article').count();
  expect(finalCardCount).toBe(initialCardCount - 1);

  console.log('This verifies the card has been removed accurately from the column.');
});

test('Toggle dark mode', async ({ page }) => {
  const kanbanPage = new KanbanPage(page);
  await kanbanPage.goto();
  
  await kanbanPage.toggleDarkMode();

  // Verify dark mode is enabled
  const isDarkMode = await kanbanPage.isDarkModeEnabled();
  expect(isDarkMode).toBe(true);
  console.log('Verify that Dark mode has been set on the web page.');

  // Verify dark mode toggle has been moved correctly
  const divTranslated = await kanbanPage.isDarkModeToggleMoved();
  expect(divTranslated).toBe(true);
  console.log('Verify that Dark mode toggle has been moved correctly.');
});
