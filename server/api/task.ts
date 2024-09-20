import { updateTaskInDatabase, deleteFromDatabase } from '../dbupdate'

export default defineEventHandler(async (event) => {
 
  
    const body  = await readBody(event)
  
    //console.log('==body',body);
    
    let res

    try {
      if (body.action=='delete'){
      res=await deleteFromDatabase( body)
      }else{
      res=await updateTaskInDatabase( body)
      }
      
      console.log('🔹 res '+body.action,res);

      return res //{ success: true }
    } catch (error) {
      console.error('Error updating board:', error)
      return createError({ statusCode: 500, statusMessage: 'Error updating board' })
    }
  })