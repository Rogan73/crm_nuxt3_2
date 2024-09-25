export interface Person{
  id: number;
  name: string;
  phone?: string;
  email?: string;
}

export interface Task {
  id: number;
  type?: string;
  title: string;
  date: string;
  description?: string;
  isOpen?: boolean;
  person? : Person;

}

export interface SelectedTaskRow {
  columnRow: number;
  taskRow: number;
}