export interface KanbanData {
	completedSubtasks: number;
	totalSubtasks: number;
	subtaskName: string;
	TaskName: string;
	columnName: string;
}

export const KanbanCard = (): KanbanData => {
	return {
		completedSubtasks: 0,
		totalSubtasks: 0,
		subtaskName: "",
		TaskName: "",
		columnName: "",
	};
};
