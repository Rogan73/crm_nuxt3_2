export interface Column {
    id: number;
    id_board: number;
    name: string;
    tasks: Task[];
  }
  
export interface Board {
    id: number;
    name: string;
    columns: Column[];
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

export interface Kanban2State {
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