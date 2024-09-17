export interface Board {
    id: number;
    name: string;
    columns: Column[];
  }
  
  export interface Column {
    id: number;
    id_board: number;
    name: string;
    tasks: Task[];
  }
  
  export interface Task {
    id: number;
    id_board: number;
    id_column: number;
    isOpen: boolean | false;
    name: string;
    description: string;
    id_person: number | null;
  }
  
  export interface Person {
    id: number;
    name: string;
    id_specialty: number | null;
    phone: string | null;
    email: string | null;
  }
  
  export interface Specialty {
    id: number;
    name: string;
  }
  
  export interface KanbanState {
    boards: Board[];
    isLoading: boolean;
    error: string | null;
    selected_border_row: number;
    selected_boardId: string;
  }