import { defineStore } from "pinia"
import { ref } from "vue"
import type { Board, KanbanState,Column } from '@/types'

export const useKanbanStore = defineStore("kanban", () => {


    const state = ref<KanbanState>({
        boards: [],
        isLoading: false,
        error: null,
        selected_border_row: 0,
        selected_boardId: '1'
      })


      const sendUpdate = async (updatedData: any) => {
        try {
          await $fetch(`/api/board/${state.value.selected_boardId}`, {
            method: 'POST',
            body: updatedData,
          })
          
        } catch (error) {
          console.error(`==Error updating board: ${state.value.selected_boardId}`, error)
        }
      }



    const getBoard = async (): Promise<void> => {
        state.value.isLoading = true
        state.value.error = null
        try {
          const response = await $fetch<Board[]>(`/api/board/${state.value.selected_boardId}`)
          console.log('==response',response);
          
          state.value.boards = response
        } catch (e) {
          console.error("==Error fetching boards:", e)
          state.value.error = e instanceof Error ? e.message : String(e)
        } finally {
          state.value.isLoading = false
        }
    }



    const moveTask=(fromTaskID:String, fromColumnId:String, toColumnId:String): void => {
      //console.log(fromTaskID, fromColumnId, toColumnId);
      const board_index=state.value.selected_border_row
      const board=state.value.boards[board_index]
      const fromColumnIndex=board.columns.findIndex((column: Column) => String(column.id) == fromColumnId) 
      const toColumnIndex=board.columns.findIndex((column: Column) => String(column.id) == toColumnId) 
      
      // const fromTaskIndex= board.columns[fromColumnIndex].tasks.length ?  board.columns[fromColumnIndex].tasks.findIndex((task: any) => task.id === fromTaskID)  : 0
      // const task=board.columns[fromColumnIndex].tasks[fromTaskIndex] 
      // board.columns[fromColumnIndex].tasks.splice(fromTaskIndex, 1) 
      // board.columns[toColumnIndex].tasks.push(task)

  // Проверка, что оба столбца найдены
  if (fromColumnIndex === -1 || toColumnIndex === -1) {
    console.error('==Column not found');
    return;
  }

  // Проверяем, что в fromColumn есть задачи
  if (!board.columns[fromColumnIndex].tasks || !board.columns[fromColumnIndex].tasks.length) {
    console.error('==No tasks in the fromColumn');
    return;
  }

  const fromTaskIndex = board.columns[fromColumnIndex].tasks.findIndex((task: any) => String(task.id) == fromTaskID);

  // Проверка, что задача найдена
  if (fromTaskIndex === -1) {
    console.error('==Task not found');
    return;
  }

  const task = board.columns[fromColumnIndex].tasks[fromTaskIndex];
  board.columns[fromColumnIndex].tasks.splice(fromTaskIndex, 1);
  board.columns[toColumnIndex].tasks.push(task);     
   
    }
  

    const addBoard = (board: Board): void => {
        state.value.boards.push(board)
      }
    
      const removeBoard = (boardId: number): void => {
        state.value.boards = state.value.boards.filter(board => board.id !== boardId)
      }

    const editBoardName = (boardId: string, name: string) => {
        state.value.boards = state.value.boards.map((board: any) => {
            if (board.id === boardId) {
                board.name = name
            }
            return board
        })
    }




    return { 
        state,
        addBoard,
        removeBoard,
        editBoardName,
        getBoard,
        moveTask
    }
})