type DefaultSQLResult = {
  rows: {
    board_id: number;
    board_name: string;
    column_id: number | null;
    column_name: string | null;
    column_order: number | null;
    task_id: number | null;
    task_name: string | null;
    task_description: string | null;
    task_order: number | null;
  }[];
};
  
  
  type RawKanbanRow = {
    board_id: number;
    board_name: string;
    column_id: number | null;
    column_name: string | null;
    column_order: number | null;
    task_id: number | null;
    task_name: string | null;
    task_description: string | null;
    task_order: number | null;
    task_created_at: Date ;
    task_inprogress_at: Date | null;
    done_at: Date | null;

  };
  
  type Task = {
    id: number;
    name: string;
    description: string | null;
    order_index: number;
    created_at: Date;
    inprogress_at: Date | null;
    done_at: Date | null;
  };
  
  type Column = {
    id: number;
    name: string;
    order_index: number;
    tasks: Task[];
  };
  
  type Board = {
    id: number;
    name: string;
    columns: Column[];
  };
  