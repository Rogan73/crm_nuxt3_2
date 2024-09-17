import { useDatabase } from '#imports'
import { initializeDatabase } from '../../utils/initDatabase'; 



function processKanbanData(rows: RawKanbanRow | RawKanbanRow[]): Board[] {
 
  const dataArray: RawKanbanRow[] = Array.isArray(rows) ? rows : [rows];

  const boardsMap: { [key: number]: Board } = {};

  dataArray.forEach((row: RawKanbanRow) => {
    if (!boardsMap[row.board_id]) {
      boardsMap[row.board_id] = {
        id: row.board_id,
        name: row.board_name,
        columns: []
      };
    }

    if (row.column_id !== null && row.column_name !== null && row.column_order !== null) {
      let column = boardsMap[row.board_id].columns.find(c => c.id === row.column_id);
      if (!column) {
        column = {
          id: row.column_id,
          name: row.column_name,
          order_index: row.column_order,
          tasks: []
        };
        boardsMap[row.board_id].columns.push(column);
      }

      if (row.task_id !== null && row.task_name !== null && row.task_order !== null) {
        column.tasks.push({
          id: row.task_id,
          name: row.task_name,
          description: row.task_description,
          order_index: row.task_order,
          created_at: row.task_created_at,
          inprogress_at: row.task_inprogress_at,
          done_at: row.done_at,
        });
      }
    }
  });

  // Преобразуем объект в массив и сортируем столбцы и задачи
  return Object.values(boardsMap).map(board => ({
    ...board,
    columns: board.columns
      .sort((a, b) => a.order_index - b.order_index)
      .map(column => ({
        ...column,
        tasks: column.tasks.sort((a, b) => a.order_index - b.order_index)
      }))
  }));
}

export default defineEventHandler(async (event) => {
  const db = useDatabase("DBKanban")

  await initializeDatabase();
  

  if (!event.context.params) {
    return createError({ statusCode: 400, statusMessage: 'Missing route parameters' })
  }


  const id = event.context.params.id
  if (!id) {
    return createError({ statusCode: 400, statusMessage: 'Missing board ID' })
  }


  // Получаем список board  по ID
  const result: DefaultSQLResult = await db.sql`SELECT 
                                    b.id AS board_id, 
                                    b.name AS board_name,
                                    c.id AS column_id,
                                    c.name AS column_name,
                                    c.order_index AS column_order,
                                    task.id AS task_id,
                                    task.name AS task_name,
                                    task.description AS task_description,
                                    task.order_index AS task_order,
                                    pers.name AS person_name,
                                    task.created_at AS task_created_at,
                                    task.inprogress_at AS task_inprogress_at,
                                    task.done_at AS task_done_at

                                  FROM boards b
                                    LEFT JOIN columns c ON b.id = c.id_board
                                    LEFT JOIN tasks task ON c.id = task.id_column
                                    LEFT JOIN persons pers ON task.id_person = pers.id
                                  Where b.id =  ${id} 
                                  ORDER BY b.id, c.order_index, task.order_index`;

    //console.log(result);
                                      

    const rows: RawKanbanRow[] =  (result.rows as RawKanbanRow[]).map(row => ({
      board_id: row.board_id,
      board_name: row.board_name,
      column_id: row.column_id,
      column_name: row.column_name,
      column_order: row.column_order,
      task_id: row.task_id,
      task_name: row.task_name,
      task_description: row.task_description,
      task_order: row.task_order,
      task_created_at: new Date(row.task_created_at),  
      task_inprogress_at: row.task_inprogress_at ? new Date(row.task_inprogress_at) : null,  
      done_at: row.done_at ? new Date(row.done_at) : null
    }));    

  return processKanbanData(rows);

})

// SELECT last_insert_rowid() AS mainboard_id;