//import { broadcastMessage } from './websocket';
import { broadcastMessage } from '@/server/plugins/initWebSocket.plugin';
import type {Task} from '@/types'


const ExecuteQuery=(query:string,params:(string | number)[],id_board:string)=>{

  console.log('ExecuteQuery id_board',id_board)

  const db = useDatabase("DBKanban")

  try {
    const stmt = db.prepare(query)
    const result = stmt.run(...params) as any

    const res1 = {updatedIdBoard:id_board }
    broadcastMessage(JSON.stringify(res1))
    console.log('✅ Message after ExecuteQuery sent to all clients')

    return {success: true }

  } catch (error) {
    console.error(`🔴 Error ExecuteQuery: `, error)
    return { success: false, error: (error as Error).message }
  }    


}

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

export async function deleteFromDatabase( body: DeleteRow) {  
  console.log('deleteFromDatabase')
  const db = useDatabase("DBKanban")

    const query_d = `
    DELETE FROM ${body.table} where id= ?
    `
    const params_d: (string)[]  = [
      body.id
    ]
    return ExecuteQuery(query_d,params_d,body.id_board)

}




export async function moveTaskInDatabase( body: Task) {
  
  console.log('moveTaskInDatabase')

  const query = `
      UPDATE tasks
      SET 
          id_column = ?,
          order_index = ?
      WHERE id = ?
    `
    const params: (string | number)[] = [
      body.id_column,
      body.order_index,
      body.id
    ]
      
    return ExecuteQuery(query,params,String(body.id_board))
}

export async function updateTaskInDatabase( body: Task) {
    let res:String

     try {


      if (body.id == 0) {
       
        console.log('--insert')
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

    //console.log('params_i',params_i)
      
    return ExecuteQuery(query_i,params_i,String(body.id_board))
        

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

      return ExecuteQuery(query,params,String(body.id_board))
     
      } else {
        throw new Error('Invalid id')
      }

    } catch (error) {
      console.error('🔴 Params error:', error)
      return { catch_error: error }
    }

     
  } 
