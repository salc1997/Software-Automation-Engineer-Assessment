import { test } from '@playwright/test';
import KanbanPage from '../pages/kanban.page';

test.describe('Kanban test', async () => {
  let kanbanPage: KanbanPage;

  test.beforeEach(async ({ page }) => {
    kanbanPage = new KanbanPage(page);
    await kanbanPage.goto();
  });

  test('1. Edit a Kanban Card', async () => {
    await kanbanPage.executeTest1();
  });

  test('2. Delete a Kanban Card', async () => {
    await kanbanPage.executeTest2();
  });

  test('3. Toggle dark mode', async () => {
    await kanbanPage.executeTest3();
  });
});

