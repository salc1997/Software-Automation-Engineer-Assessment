// @ts-check
const { test, expect } = require('@playwright/test');


let app = 'https://kanban-566d8.firebaseapp.com/'; // Kanban url

// Test for Edit Kanban Card
  test('Edit Kanban Card', async ({ page }) => {
    let firstColumn;
    let found = false; //Flag if found a kanban card that is not completed

    // Navigate to Kanban url
    await page.goto(app); 
  
    // Wait fors kanban columns
    await page.waitForSelector('div[class="flex gap-6"]');
    // Kanban first column title
    const indexKanbanTitle = await page.$('section:nth-child(1) > div.flex.items-center.gap-3.pb-6 > h2');
  
    // Get the text content of Kanban first column title
    firstColumn = await indexKanbanTitle.textContent();
  
    //Get total length of sections (Number of Kanban Columns)
    const targetDiv = await page.$('div[class="flex gap-6"]');
    const sectionElements = await targetDiv.$$(':scope > section');
    const count = sectionElements.length;
  
    // Loop trough kanban columns (Skip for first Kanban)
    for (let i = 2; i <= count; i++) {  
      let targetSection = await page.$(`section:nth-child(${i}) > div.flex.flex-col.gap-5`);
      let sectionElements = await targetSection.$$(':scope > article');
      let articleLength = sectionElements.length
      console.log(`LENGTH : ${articleLength}`)

      //Loop Trough kanban rows per column and complete an uncompleted subtask
      for(let j = 1; j <= articleLength; j++){
        let selector = `section:nth-child(${i}) article:nth-child(${j}) > p.text-xs.text-medium-grey.font-bold.select-none`
        let element = await page.$(selector);
        let text = await element.textContent();
        console.log(`Content:${text}`);

        // Check if uncompleted subtask ie. 2 of 3
        if(text.split(' ')[0] < text.split(' ')[2]){
          await page.click(selector); 
          found = true
          break;
        }
      }
      if(found) break;

    }

    // Check all unchecked checkboxes on the subtask
    const checkboxSelector = `div[class="flex flex-col gap-2"] span[class="text-black dark:text-white text-xs font-bold"]`; 
    const checkboxes = await page.$$(checkboxSelector);
    for (const checkbox of checkboxes) {
        await checkbox.check();
        console.log('Checked checkbox with selector:', checkboxSelector);
    }

    //Get First column title(Removed total number of column title i.e Bravery (10))
    const match = firstColumn.match(/^(.+?)\s*\(/);
    const result = match ? match[1].trim() : '';

    //Get Subtask title
    let kanbanTitle = await page.$('h4[class="text-black dark:text-white font-bold text-lg"]');
    let kanbanTitleText= await kanbanTitle.textContent();

    //Change the Current Status to first column
    await page.dblclick('div[class="group-focus:hidden"]');
    await page.waitForTimeout(1000);
    await page.getByText(result,{ exact: true }).click();
    await page.waitForTimeout(3000);

    //Check if subtask is successfully moved to first column
    let firstSection = await page.$(`section:nth-child(1) > div.flex.flex-col.gap-5`);
    let firstSectionElements = await firstSection.$$(':scope > article');
    let articleLength = firstSectionElements.length
    const xpathExpression = `//section[1]//div[contains(@class, \'flex\') and contains(@class, \'flex-col\') and contains(@class, \'gap-5\')]//article[${articleLength}]//h3[contains(text(), '${kanbanTitleText}')]`;
    const locator = page.locator(`xpath=${xpathExpression}`);
    await expect(locator).toBeVisible(); // Check if the element is visible

  });

  //Test for Delete Kanban Card
  test('Delete Kanban Card', async ({ page }) => {
    // Navigate to the target webpage
    await page.goto(app);
  
    // Wait for the section and h2 to be available
    await page.waitForSelector('section:nth-child(1) > div.flex.items-center.gap-3.pb-6 > h2');

    //Open subtask
    await page.click("article:nth-child(1)");
    await page.waitForTimeout(1000);

    //Delete Subtask
    let kanbanTitle = await page.$('h4[class="text-black dark:text-white font-bold text-lg"]');
    let kanbanTitleText= await kanbanTitle.textContent();
    await page.click(".flex.justify-between.items-center.gap-4 > .group.cursor-pointer.relative");
    await page.waitForTimeout(1000);
    await page.getByText("Delete Task",{ exact: true }).click();
    await page.getByRole('button',{ name: 'Delete' }).click();
    await page.waitForTimeout(1000);

    // Assert that the element is removed
    const xpathExpression = `//*[contains(text(), '${kanbanTitleText}')]`
    const locator = page.locator(`xpath=${xpathExpression}`);
    await expect(locator).toBeHidden(); 

  });

  //Test for Toggle Dark Mode
  test('Toggle Dark Mode', async ({ page }) => {
    // Navigate to the target webpage
    await page.goto(app);
  
    // Wait for First column title to load
    await page.waitForSelector('section:nth-child(1) > div.flex.items-center.gap-3.pb-6 > h2');

    // Locate the toggle button
    const toggleButton = page.locator('div.bg-light-grey.flex label.bg-main-purple'); 

    // Click the toggle button
    await toggleButton.click();

    // Get <html> element
    const body = page.locator('html');

    // Assert that the <html> element has the 'dark' class
    await expect(body).toHaveClass(/dark/);
  
  });

