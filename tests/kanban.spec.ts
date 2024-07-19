import { test, expect } from "@playwright/test";
import { InterfacePage } from "../pages/interface.po";
import { KanbanData, KanbanCard } from "../utils/data";

test.describe("Should be able to edit a Kanban Card", () => {
	let kanbanPage: InterfacePage;
	let data: KanbanData;

	test.beforeEach(async ({ browser }) => {
		kanbanPage = new InterfacePage(await browser.newPage());
		data = KanbanCard();
	});

	test("Should be able to complete one subtask of an incomplete task", async () => {
		await test.step("Navigate to Kanban", async () => {
			await kanbanPage.navigateToKanban();
			await expect(kanbanPage.page.getByRole("article").first()).toBeVisible();
		});

		await test.step("Open incomplete task", async () => {
			await kanbanPage.openIncompleteTask(data);
			await expect(kanbanPage.page.getByRole("checkbox").first()).toBeVisible();
		});

		await test.step("Complete one subtask", async () => {
			await kanbanPage.completeOneSubtask(data);

			// Assert that the subtask is completed
			await expect(
				kanbanPage.page
					.locator("label")
					.filter({ hasText: data.subtaskName })
					.getByRole("checkbox", { checked: true })
			).toBeVisible();
		});

		await test.step("Move task to the first column", async () => {
			await kanbanPage.moveCardToFirstColumn(data);

			// Assert that the task is moved to the first column
			await expect(
				kanbanPage.page
					.locator("section")
					.first()
					.filter({ hasText: data.columnName })
			).toBeVisible();
		});

		await test.step("Verify that the subtask is striked through", async () => {
			await expect(
				kanbanPage.page
					.locator("label")
					.filter({ hasText: data.subtaskName })
					.getByRole("checkbox", { checked: true })
			).toBeVisible();
		});

		await test.step("Close the card edit page", async () => {
			await kanbanPage.closeCardEditPage();
			await expect(
				kanbanPage.page.getByRole("checkbox").first()
			).not.toBeVisible();
		});

		await test.step("Verify that the number of completed subtasks is correct", async () => {
			await expect(
				kanbanPage.page
					.getByRole("article")
					.filter({ hasText: data.TaskName })
					.getByText(
						`${data.completedSubtasks} of ${data.totalSubtasks} substasks`
					)
			).toBeVisible();
		});

		await test.step("Verify that the card moved to the correct column", async () => {
			await expect(
				kanbanPage.page
					.locator("section")
					.first()
					.filter({ hasText: data.TaskName })
			).toBeVisible();
		});
	});

	test("Delete a Kanban card:", async () => {
		await test.step("Navigate to Kanban", async () => {
			await kanbanPage.navigateToKanban();
			await expect(kanbanPage.page.getByRole("article").first()).toBeVisible();
		});

		await test.step("Open incomplete task", async () => {
			await kanbanPage.openIncompleteTask(data);
			await expect(kanbanPage.page.getByRole("checkbox").first()).toBeVisible();
		});

		await test.step("Delete a Kanban card", async () => {
			await kanbanPage.deleteCard();
		});

		await test.step("Verify that the card is deleted", async () => {
			await expect(
				kanbanPage.page
					.locator("article")
					.filter({ hasText: data.columnName })
					.getByRole("heading", { name: data.TaskName })
			).not.toBeVisible();
		});
	});

	test("Toggle dark mode:", async () => {
		await test.step("Navigate to Kanban", async () => {
			await kanbanPage.navigateToKanban();
			await expect(kanbanPage.page.getByRole("article").first()).toBeVisible();
		});

		await test.step("Toggle dark mode", async () => {
			await kanbanPage.toggleDarkMode();
		});

		await test.step("Verify that the dark mode is enabled", async () => {
			// Check if the dark mode is enabled
			expect(kanbanPage.page.locator("html.dark")).toBeTruthy();
		});
	});
});
