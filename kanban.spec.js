const {test, expect} = require('@playwright/test');

test('testCase1',async ({page})=>{
//test case 1.1. navigate to kanban app
    await page.goto('https://kanban-566d8.firebaseapp.com');

//test case 1.2. Choose a card with subtasks that are not completed and that is not in the first column
    //2nd column and article pointer
    await page.click("//div[@class='flex gap-6']/section[2]/div[2]/article[1]");

    let frstColCounter = await page.locator("//*[@id='app']/main/div[1]/div[2]/div/div/div[1]/section[1]/div[2]/article").count();

    //checkbox locator
    const chkBox = "//div[@class='flex flex-col gap-2']/label";
    const chkBoxCount= await page.locator(chkBox).count();
    let chkBxLocator = page.locator(chkBox + "[1]");

//test case 1.3. complete one subtask
    //looking for uncheck checkbox
    let i;
    for(i = 2; i <= chkBoxCount; i++){;
        if(await chkBxLocator.isChecked() === false){
            await chkBxLocator.check();
            break;
        }else{
            chkBxLocator = page.locator(chkBox + "[" + i + "]")
        }
    }

    //clicking dropdown
    const drpDown = await page.locator("//*[@id='app']/div[2]/div/div/div[3]/div").click();

//test case 1.4. moving task to the first column
    const moveToFirstCol = await page.locator("//*[@id='app']/div[2]/div/div/div[3]/div/div[3]/div[1]").click();

//test case 1.5. Verify that the subtask is striked through
    i--;
    expect(await page.locator(chkBox + "[" + i + "]").isChecked()).toBeTruthy();

//test case 1.6. close the card edit page
    await page.click("//*[@id='app']/div[2]/div/div/div[1]/div/div[1]");
    await page.click("//*[@id='app']/div[2]/div/div/div[1]/div/div[2]/div/p[1]");
    await page.click("//button[@type='submit']");

    //get the updated article
    let counter = await page.locator("//*[@id='app']/main/div[1]/div[2]/div/div/div[1]/section[1]/div[2]/article").count();
    const check = await page.click("//*[@id='app']/main/div[1]/div[2]/div/div/div[1]/section[1]/div[2]/article["+counter+"]");
    

    await page.waitForTimeout(1000);
})

test('testCase2',async ({page})=>{

    //test case 2.1. navigate to kanban app
    await page.goto('https://kanban-566d8.firebaseapp.com');

    //column and article pointer
    const article = page.locator("//div[@class='flex gap-6']/section[1]/div[2]/article[1]");
    article.click();
    
    //column article count
    let articleCnt = await page.locator("//div[@class='flex gap-6']/section[1]/div[2]/article").count();
    
    await page.click("//*[@id='app']/div[2]/div/div/div[1]/div/div[1]");
    await page.click("//*[@id='app']/div[2]/div/div/div[1]/div/div[2]/div/p[2]");

    const deleteButton = page.locator("//*[@id='app']/div[2]/div/div/div[2]/div[1]/button");
    await expect(deleteButton).toBeVisible();

    //test case 2.2 Delete a Kanban card
    //test case 2.3 Verify that the card is no longer present
    await deleteButton.click();
    expect(deleteButton.click);
    await page.waitForTimeout(1000);

    //test case 2.4 Verify that the column of the removed card is accurate
    let articleUpdatedCnt = await page.locator("//div[@class='flex gap-6']/section[1]/div[2]/article").count();
    expect(articleUpdatedCnt).toBeLessThan(articleCnt);

    await page.waitForTimeout(3000);
})

test('testCase3',async ({page})=>{

    //test case 3.1. navigate to kanban app
    await page.goto('https://kanban-566d8.firebaseapp.com');

    const clicker = page.locator("//label[@class='bg-main-purple hover:bg-main-purple-light cursor-pointer min-w-[40px] min-h-[22px] p-1 rounded-xl relative']");
    await expect(clicker).toBeVisible();

    await clicker.click();

    await page.waitForTimeout(1000);
})