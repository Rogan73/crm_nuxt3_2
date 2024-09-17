import { updateBoardInDatabase } from '../../dbupdate'

export default defineEventHandler(async (event) => {
  // Проверяем наличие параметров
  if (!event.context.params) {
    return createError({ statusCode: 400, statusMessage: 'Missing route parameters' })
  }

  const id = event.context.params.id
  if (!id) {
    return createError({ statusCode: 400, statusMessage: 'Missing board ID' })
  }

  const body = await readBody(event)

  try {
    await updateBoardInDatabase(id, body)
    
    return { success: true }
  } catch (error) {
    console.error('Error updating board:', error)
    return createError({ statusCode: 500, statusMessage: 'Error updating board' })
  }
})