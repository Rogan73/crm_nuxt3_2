//import { broadcastMessage } from './websocket';
import { broadcastMessage } from '@/server/plugins/initWebSocket.plugin';
import type {Task} from '@/types'


export async function updateBoardInDatabase(id: string, data: any) {
    try {
    // Update data to DB
  

    } catch (error) {
      console.error('Error updating board in database:', error)
      throw error
    }

    const body = `updatedIdBoard=${id}`
    broadcastMessage(JSON.stringify(body));
    console.log('Message sent to all clients');

  }


export async function updateTaskInDatabase( body: Task) {
    const db = useDatabase("DBKanban")

    let res:String

     try {

      if (body.id == 0) {
        // INSERT 
        
        console.log('--insert')

        // const result = await db.sql`
        //   INSERT INTO tasks (id_board, id_column, status, name, description, id_person, order_index)
        //   VALUES (${body.id_board}, ${body.id_column}, ${body.state}, '${body.name}', '${body.description}', ${body.id_person}, ${body.order_index})
        // `


        const query_i = `
        INSERT INTO tasks (id_board, id_column, state, name, description, id_person, order_index)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `
     

      const params_i: (string | number)[]  = [
        body.id_board,
        body.id_column,
        body.state,
        body.name,
        body.description,
        body.id_person,
        body.order_index
      ]

    console.log('params_i',params_i)
      
    
      try {
        const stmt = db.prepare(query_i)
        const result = stmt.run(...params_i) as any

        const res1 = {updatedIdBoard:body.id_board }
        broadcastMessage(JSON.stringify(res1))
        console.log('✅ Message after insert sent to all clients')

        return {success: true, id: result.lastInsertRowid, changes: result.changes    }

      } catch (error) {
        console.error('🔴 Error inserting task:', error)
        return { success: false, error: (error as Error).message }
      }

        //console.log('result after insert',result)
        //SELECT last_insert_rowid() AS mainboard_id;
        

      } else if (body.id > 0) {

        const query = `
        UPDATE tasks
        SET id_board = ?,
            id_column = ?,
            state = ?,
            name = ?,
            description = ?,
            id_person = ?,
            order_index = ?
        WHERE id = ?
      `
      
      const params: (string | number)[] = [
        body.id_board,
        body.id_column,
        body.state,
        body.name,
        body.description,
        body.id_person,
        body.order_index,
        body.id
      ]

      try {
        const stmt = db.prepare(query)
        const result = stmt.run(...params) as any


        const res2 = {updatedIdBoard:body.id_board }
        broadcastMessage(JSON.stringify(res2))
        console.log('✅ Message after update sent to all clients')

        return { success:true, message: 'Task updated successfully',id_board: body.id_board, id: body.id }

      } catch (error) {
        console.error('🔴 Error updating task:', error)
        return { success: false, error: (error as Error).message }
      }
        
      //console.log('result after update',result)
     
      } else {
        throw new Error('Invalid id')
      }

    } catch (error) {
      console.error('🔴 Database error:', error)
      return { catch_error: error }
    }
     


     
  } 
