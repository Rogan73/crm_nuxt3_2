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
    state: number;
    id_board: number;
    id_column: number;
    isOpen: boolean | false;
    name: string;
    description: string;
    id_person: number ;
    order_index: number;
    
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
    title:string;
    boards: Board[];
    isLoading: boolean;
    error: string | null;
    selected_board_row: number;
    selected_boardId: string;
    showTask: boolean;
    selected_task:Task;
    new_task: boolean;
  }

  export  interface TaskUpdateBody {
    id: number
    id_board: number
    id_column: number
    state: number
    name: string
    description: string
    id_person: number
    order_index: number
  }

  export interface QueryResult {
    changes: number
    lastInsertRowid: number
  }

  export interface toDrop {
    columnIndex: number | null;
    taskIndex: number | null;
  }