import { useDatabase } from '#imports'
import { existsSync } from 'fs'
import { resolve } from 'path'

let databaseInitialized = false


function processKanbanData(rows: RawKanbanRow | RawKanbanRow[]): Board[] {
  // Убедимся, что rows - это массив
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
          completed_at: row.task_completed_at,
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

  if (!databaseInitialized) {
    const dbPath = resolve(process.cwd(), '.data', 'dbkanban.sqlite3')
    
    if (!existsSync(dbPath)) {
      
      await db.sql`PRAGMA foreign_keys = ON;`
      
      await db.sql`CREATE TABLE IF NOT EXISTS boards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      )`

      await db.sql`CREATE TABLE IF NOT EXISTS columns (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_board INTEGER NOT NULL,
        name TEXT NOT NULL,
        order_index INTEGER NOT NULL,
        FOREIGN KEY (id_board) REFERENCES boards(id) ON DELETE CASCADE
      )`

      await db.sql`CREATE TABLE IF NOT EXISTS specialties (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
      )`
      
      await db.sql`CREATE TABLE IF NOT EXISTS persons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        id_specialty INTEGER,
        phone TEXT,
        email TEXT,
        FOREIGN KEY (id_specialty) REFERENCES specialties(id) ON DELETE SET NULL
      )`

      await db.sql`CREATE TABLE IF NOT EXISTS executors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_task INTEGER NOT NULL ,
        id_person INTEGER NOT NULL,
        FOREIGN KEY (id_task) REFERENCES tasks(id) ON DELETE CASCADE,
        FOREIGN KEY (id_person) REFERENCES persons(id) ON DELETE CASCADE         

      )`

      await db.sql`CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_board INTEGER NOT NULL,
        id_column INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        id_person INTEGER,
        order_index INTEGER NOT NULL,
        created_at DATETIME  DEFAULT CURRENT_TIMESTAMP,
        inprogress_at DATETIME,
        done_at DATETIME,
        FOREIGN KEY (id_board) REFERENCES boards(id) ON DELETE CASCADE,
        FOREIGN KEY (id_column) REFERENCES columns(id) ON DELETE CASCADE,
        FOREIGN KEY (id_person) REFERENCES persons(id) ON DELETE SET NULL
      )`

      await db.sql`INSERT INTO boards (name) VALUES ('MainBoard') `
      await db.sql`INSERT INTO columns (id_board,name,order_index) VALUES (1,'todo',1) `
      await db.sql`INSERT INTO columns (id_board,name,order_index) VALUES (1,'inprogress',2) `
      await db.sql`INSERT INTO columns (id_board,name,order_index) VALUES (1,'done',3) `
      await db.sql`INSERT INTO specialties (name) VALUES ('Designer') `
      await db.sql`INSERT INTO persons (name,id_specialty,phone,email) VALUES ('ALEX',1,'322-223-322','mail@mail.com') `
      await db.sql`INSERT INTO tasks (id_board,id_column,name,description,id_person,order_index) VALUES (1,1,'Test Project','Create the design of project',1,1) `

    }

    databaseInitialized = true
  }
  






  // Получаем список досок
  const result: DefaultSQLResult = await db.sql`SELECT 
                                    b.id AS board_id, 
                                    b.name AS board_name,
                                    c.id AS column_id,
                                    c.name AS column_name,
                                    c.order_index AS column_order,
                                    task.id AS task_id,
                                    task.name AS task_name,
                                    task.description AS task_description,
                                    task.order_index AS task_order
                                  FROM boards b
                                    LEFT JOIN columns c ON b.id = c.id_board
                                    LEFT JOIN tasks task ON c.id = task.id_column
                                    LEFT JOIN persons pers ON task.id_person = pers.id
                                  
                                  ORDER BY b.id, c.order_index, task.order_index`;

    //console.log(result);
                                      

    const rows: RawKanbanRow[] = result.rows.map(row => ({
      board_id: row.board_id,
      board_name: row.board_name,
      column_id: row.column_id,
      column_name: row.column_name,
      column_order: row.column_order,
      task_id: row.task_id,
      task_name: row.task_name,
      task_description: row.task_description,
      task_order: row.task_order
    }));    

  return processKanbanData(rows);

})

// SELECT last_insert_rowid() AS mainboard_id;