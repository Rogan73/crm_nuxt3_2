import { useDatabase } from '#imports'
import { existsSync } from 'fs'
import { resolve } from 'path'

let databaseInitialized = false

export async function initializeDatabase() {
    const db = useDatabase("DBKanban");
  
    if (!databaseInitialized) {
      const dbPath = resolve(process.cwd(), '.data', 'dbkanban.sqlite3');
  
      if (!existsSync(dbPath)) {

        let step=0

        try {



        await db.sql`PRAGMA foreign_keys = ON;`;

        step =1

        await db.sql`CREATE TABLE IF NOT EXISTS boards (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
          )`

        step =2  
    
          await db.sql`CREATE TABLE IF NOT EXISTS columns (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_board INTEGER NOT NULL,
            name TEXT NOT NULL,
            order_index INTEGER NOT NULL,
            FOREIGN KEY (id_board) REFERENCES boards(id) ON DELETE CASCADE
          )`
          step =3 

          await db.sql`CREATE TABLE IF NOT EXISTS specialties (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
          )`
          
          step =4 

          await db.sql`CREATE TABLE IF NOT EXISTS persons (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            id_specialty INTEGER,
            phone TEXT,
            email TEXT,
            FOREIGN KEY (id_specialty) REFERENCES specialties(id) ON DELETE SET NULL
          )`
    
          step =5 

          await db.sql`CREATE TABLE IF NOT EXISTS executors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_task INTEGER NOT NULL ,
            id_person INTEGER NOT NULL,
            FOREIGN KEY (id_task) REFERENCES tasks(id) ON DELETE CASCADE,
            FOREIGN KEY (id_person) REFERENCES persons(id) ON DELETE CASCADE         
    
          )`

          step =6 
    
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

          step =7 
    
          await db.sql`INSERT INTO boards (name) VALUES ('MainBoard') `
          await db.sql`INSERT INTO columns (id_board,name,order_index) VALUES (1,'todo',1) `
          await db.sql`INSERT INTO columns (id_board,name,order_index) VALUES (1,'inprogress',2) `
          await db.sql`INSERT INTO columns (id_board,name,order_index) VALUES (1,'done',3) `
          await db.sql`INSERT INTO specialties (name) VALUES ('Designer') `
          await db.sql`INSERT INTO persons (name,id_specialty,phone,email) VALUES ('ALEX',1,'322-223-322','mail@mail.com') `
          await db.sql`INSERT INTO tasks (id_board,id_column,name,description,id_person,order_index) VALUES (1,1,'Test Project','Create the design of project',1,1) `
          step =8 
        } catch (error) {
            console.error('Database setup error at step', step, ':', error);
            // Возвращаем ошибку клиенту
            throw new Error('Internal Server Error during database setup');
        }
    
          databaseInitialized = true;
        
      }

     
    }
  }
