export interface Person{
  id: number;
  name: string;
  phone?: string;
  email?: string;
}

export interface Task {
  id?: string;
  type?: string;
  title: string;
  date: string;
  date_deadline?: string;
  description?: string;
  isOpen?: boolean;
  person? : Person;
  date_inprogress?: string;
  date_review?: string;
  date_done?: string;

}

export interface SelectedBoard {
  boardId: string;
  boardName: string;
}

export interface SelectedTaskRow {
  columnRow: number;
  taskRow: number;
  columnId?: string;
}

