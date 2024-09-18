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

        const result = await db.sql`
          INSERT INTO tasks (id_board, id_column, status, name, description, id_person, order_index)
          VALUES (${body.id_board}, ${body.id_column}, ${body.state}, '${body.name}', '${body.description}', ${body.id_person}, ${body.order_index})
        `
        
        console.log('result after insert',result)

         //SELECT last_insert_rowid() AS mainboard_id;

        
         res=JSON.stringify( { success:true, message: 'Task created successfully', id_board: body.id_board })

      } else if (body.id > 0) {
        console.log('--update1')
        console.log('--update',`
          UPDATE tasks
          SET id_board = ${body.id_board},
            id_column = ${body.id_column},
            state = ${body.state},
            name = '${body.name}',
            description = '${body.description}',
            id_person = ${body.id_person},
            order_index = ${body.order_index}
        WHERE id = ${body.id}
        `)

        console.log('--update2')

        const result = await db.sql`
          UPDATE tasks
          SET id_board = ${body.id_board},
            id_column = ${body.id_column},
            state = ${body.state},
            name = '${body.name}',
            description = '${body.description}',
            id_person = ${body.id_person},
            order_index = ${body.order_index}
        WHERE id = ${body.id}
        `
        
        console.log('result after update',result)

       
       res=JSON.stringify( { success:true, message: 'Task updated successfully',id_board: body.id_board, id: body.id } )
      } else {
        throw new Error('Invalid id')
      }

    } catch (error) {
      console.error('Database error:', error)
      return { catch_error: error }
    }
     
    const response = `updatedIdBoard=${body.id_board}`
    broadcastMessage(JSON.stringify(res));
    console.log('Message sent to all clients');

     
  } 
