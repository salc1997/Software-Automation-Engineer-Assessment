import { BasePage } from "./basePage";
import { KanbanLocators } from "./locators/kanban";
import { Locator, Page } from "@playwright/test";

export class KanbanPage extends BasePage {

    private readonly windowArticle: Locator;
    private readonly sectionList: Locator;
    private readonly articlesItem: Locator;
    private readonly articlesInSection: Locator;
    private readonly darkModeToggleButton: Locator;

        constructor(page: Page){
            super(page);
            this.windowArticle = page.locator(KanbanLocators.windowArticle);
            this.sectionList = page.locator(KanbanLocators.sectionList);
            this.articlesItem = page.locator(KanbanLocators.articlesItem);
            this.articlesInSection = page.locator(KanbanLocators.articlesInSection);
            this.darkModeToggleButton = page.locator(KanbanLocators.darkModeToggleButton);
        }

      /*  async loginWithCorrectUser(){
            await this.fillField(LoginLocators.username, 'student');
        }*/

            async howManyElementsExist(){
                const sectionListElements = this.sectionList.all();
                let totalKanbanCards = 0;
                for (let i = 0; i < (await sectionListElements).length ; i++) {
                    const section = sectionListElements[i];
                    const articles = await section.locator('article').all();
                    totalKanbanCards += articles.length;
                }
                return totalKanbanCards;
            }

            async deleteACard(){
                const articles = await this.articlesInSection.all();
                if (articles.length > 0) {
                  const randomIndex = Math.floor(Math.random() * articles.length);
                  const randomArticle = articles[randomIndex];
                  await randomArticle.click();
                  console.log(await randomArticle.innerHTML())
                  const windowsArticle = await this.windowArticle.first().click();
                } 
            }

            /*async didIDeleteSomeCard(){
                const beforeDelete = this.howManyElementsExist();

                const afterDelete = this.howManyElementsExist();

            }*/
}