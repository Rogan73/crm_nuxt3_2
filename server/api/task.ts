import { updateTaskInDatabase } from '../dbupdate'

export default defineEventHandler(async (event) => {
 
  
    const body = await readBody(event)
  
    //console.log('==body',body);
    

    try {
      let res=await updateTaskInDatabase( body)
      
      console.log('==res',res);

      return res //{ success: true }
    } catch (error) {
      console.error('Error updating board:', error)
      return createError({ statusCode: 500, statusMessage: 'Error updating board' })
    }
  })