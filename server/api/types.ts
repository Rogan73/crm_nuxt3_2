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
    column_id: number | -1;
    column_name: string | null;
    column_order: number | -1;
    state:number | -1;
    person_id:number | -1;
    person_name:string | null;
    task_id: number | -1;
    task_name: string | null;
    task_description: string | null;
    task_order: number | -1;
    task_created_at: Date ;
    task_inprogress_at: Date | null;
    done_at: Date | null;

  };
  
  type Task = {
    id: number;
    id_board:number;
    id_column:number;
    name: string;
    state:number;
    id_person:number;
    person_name:string | null;
    description: string | null;
    order_index: number;
    created_at: Date;
    inprogress_at: Date | null;
    done_at: Date | null;
    action: string;
  };


  type DeleteRow = {
    table:string;
    id:string;
    id_board:string;
    action:string;
  }
  
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
  