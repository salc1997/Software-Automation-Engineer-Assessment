import { chromium, Browser} from 'playwright';
import { test, expect, type Page } from '@playwright/test';
import config from '../playwright.config';

test.beforeEach(async ({ page }) => {

  await page.goto('https://kanban-566d8.firebaseapp.com/');

});

test.describe('Assessment', () => {

  test('Delete Kanban Card', async ({ page }) => {
    // Wait for first card to appear
    const firstCard = '//div[@class="flex flex-col gap-5"]/article[1]'
    await page.waitForSelector(firstCard);
    const firstCardTitle = (await page.waitForSelector(firstCard)).innerText();

    // Delete first card
    await page.click(firstCard);
    await page.click('//*[@id="app"]/div[2]/div/div/div[1]/div/div[1]');
    await page.click(('//*[@id="app"]/div[2]/div/div/div[1]/div/div[2]/div/p[2]'));
    await page.click(('//*[@id="app"]/div[2]/div/div/div[2]/div[1]/button'));
    await page.waitForTimeout(1000);

    // Verify that the deleted card is no longer visible
    const deletedCard = page.locator('h3:has-text("' + firstCardTitle + '")');
    await expect(deletedCard).toBeHidden();

  });

  test('Toggle Dark Mode', async ({ page }) => {
    // Get class
    const pageText = await page.evaluate(() => document.body.classList.contains('translate-x-[18px]'));
    expect(pageText).toBeFalsy(); // Ensure dark mode is turned off

    // Click on toggle button
    await page.click('//*[@id="app"]/main/div[1]/div[1]/div/div[4]/div[1]/label/div');
    await page.waitForTimeout(1000);

    // Verify
    const deletedCard = page.locator('div:has-text("translate-x-[18px]")');
    await expect(deletedCard).toBeHidden();
});

});