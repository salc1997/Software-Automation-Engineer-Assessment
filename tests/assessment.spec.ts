import { expect, test } from '@playwright/test';
import { KanbanPage } from '../pages/kanbanPage';
import { BasePage } from '../pages/basePage';


test('Edit a Kanban Card', async ({ page }) => {
  const kanban = new KanbanPage(page);
  const base = new BasePage(page);
  await base.loadWeb("https://kanban-566d8.firebaseapp.com/task1722528156947");
  const columnContainer = (await page.locator('section:has(.group)').all()).slice(1); 
  const randomIndex = Math.floor(Math.random() * columnContainer.length)
  const randomItem = columnContainer[randomIndex];
  console.log(columnContainer);
  console.log(columnContainer[randomIndex])

for(var item of columnContainer){
  const kanbanCompletedTaskText = item.locator('p[class = "text-xs"]');
      console.log(await kanbanCompletedTaskText.innerHTML());
}



  await page.pause();
});


test('Delete a Kanban Card', async ({ page })=> {
  const kanban = new KanbanPage(page);
  const base = new BasePage(page);
  await base.loadWeb("https://kanban-566d8.firebaseapp.com/task1722528156947");
  const sections = await page.locator('section').all();

  let totalKanbanCards = 0;
  for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const articles = await section.locator('article').all();
      totalKanbanCards += articles.length;
  }

  console.log(totalKanbanCards)

  const articles = await page.locator('section article').all();
    /* check how many cards there are before deleting */ 
  if (articles.length > 0) {
    const randomIndex = Math.floor(Math.random() * articles.length);
    const randomArticle = articles[randomIndex];
    await randomArticle.click();
    console.log(await randomArticle.innerHTML())
    const windowsArticle = await page.locator('div.absolute svg g[fill-rule="evenodd"]').first().click();
    await page.getByText('Delete Task').click();
    await page.getByRole('button', { name: 'Delete' }).click();
  } 

  /* check how many cards there are after deleting */ 
let totalKanbanCards2 = 0;
for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const articles = await section.locator('article').all();
    totalKanbanCards2 += articles.length;
}

console.log(totalKanbanCards2)

expect(totalKanbanCards).not.toEqual(totalKanbanCards2);

})

test('Toggle dark mode', async ({ page })=> {
  const kanban = new KanbanPage(page);
  const base = new BasePage(page);
  await base.loadWeb("https://kanban-566d8.firebaseapp.com/task1722528156947");
  /* looking for the toggle */
  const darkModeToggleLabel = page.locator('label:has(input[type="checkbox"])');

  await darkModeToggleLabel.click();
  const htmlDarkTag = page.locator('html');

  /* check if the html tag has the class dark */
  const isTheDarkModeOn = await htmlDarkTag.evaluate(el => el.classList.contains('dark'));

  /* Check if the dark mode is on */
  expect(isTheDarkModeOn).toBe(true); 
})