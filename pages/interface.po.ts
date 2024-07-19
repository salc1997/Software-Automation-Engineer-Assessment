import { Page, expect } from "@playwright/test";
import { KanbanData } from "../utils/data";

export class InterfacePage {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	async navigateToKanban() {
		await this.page.goto("/", { waitUntil: "load" });
		await expect(this.page.getByText(/ALL BOARDS/)).toBeVisible();
	}

	async findTaskWithIncompleteSubtaskNotInFirstColumn(data: KanbanData) {
		const articles = await this.page
			.locator("section")
			.last() // just select the last section
			.getByRole("article")
			.all();

		// find the first incomplete task with a subtask
		const findIncompleteTaskIndex = async () => {
			for (let i = 0; i < articles.length; i++) {
				const paragraph = await articles[i].getByRole("paragraph");
				const text = await paragraph.innerText();

				const parts = text.split(" of ");
				if (parts.length === 2) {
					const completed = parseInt(parts[0], 10);
					data.completedSubtasks = completed + 1;
					const total = parseInt(parts[1].split(" ")[0], 10);
					data.totalSubtasks = total;

					if (!isNaN(completed) && !isNaN(total) && completed < total) {
						return i;
					}
				}
			}
			return -1; // Return -1 if no incomplete task is found
		};
		const nth = await findIncompleteTaskIndex();

		const incompleteTaskName = await this.page
			.locator("section")
			.last()
			.locator("article")
			.nth(nth);
		const incompleteTaskHeading = await incompleteTaskName
			.getByRole("heading")
			.innerText();
		data.TaskName = incompleteTaskHeading;
	}

	async openIncompleteTask(data: KanbanData) {
		await this.findTaskWithIncompleteSubtaskNotInFirstColumn(data);

		await this.page
			.locator("section")
			.last()
			.locator("article")
			.filter({ hasText: data.TaskName })
			.click();
	}

	async completeOneSubtask(data: KanbanData) {
		// find the first incomplete task with a subtask
		const incompleteSubTask = this.page
			.locator("label")
			.filter({ has: this.page.getByRole("checkbox", { checked: false }) })
			.first();

		const incompleteSubTaskName = await incompleteSubTask.innerText();
		await incompleteSubTask.click();
		data.subtaskName = incompleteSubTaskName;
		return incompleteSubTaskName;
	}

	async moveCardToFirstColumn(data: KanbanData) {
		await this.page.locator("//div[@tabindex='1']").last().click();
		const firstColumn = await this.page
			.locator("section")
			.getByRole("heading")
			.first()
			.innerText();
		const columnName = firstColumn.split(" (");
		await this.page.getByText(columnName[0]).last().click();
		data.columnName = columnName[0];
		return columnName[0];
	}

	async closeCardEditPage() {
		await this.page.locator("#app > div").first().click();
	}

	async deleteCard() {
		await this.page
			.locator("div")
			.filter({ hasText: /^Edit TaskDelete Task$/ })
			.getByRole("img")
			.click();
		await expect(this.page.getByText("Delete Task")).toBeVisible();
		await this.page.getByText("Delete Task").click();
		await expect(this.page.getByText("Are you sure you want to")).toBeVisible();
		await this.page.getByRole("button", { name: "Delete" }).click();
	}

	async toggleDarkMode() {
		await this.page.locator("label").click();
	}
}
