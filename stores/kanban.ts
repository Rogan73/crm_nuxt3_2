import { defineStore } from "pinia"
import { ref } from "vue"
import type { Board, KanbanState,Column,Task } from '@/types'
import { useRouter } from 'vue-router'
import { useConfirmStore } from '@/stores/storeConfirm'



export const useKanbanStore = defineStore("kanban", () => {

    const router = useRouter()

   const Task_new =ref<Task>({
    id: 0,
    state:1, // 1 to do  2 in progress 3 done
    id_board: 0,
    id_column: 0,
    isOpen: false,
    name: '',
    description: '',
    id_person: null,
    order_index: 0
   })


    const state = ref<KanbanState>({
        title: '',
        boards: [],
        isLoading: false,
        error: null,
        selected_board_row: 0,
        selected_boardId: '1',
        showTask: false,
        selected_task: Task_new.value,
        new_task:false
      })

      const { showConfirm } = useConfirmStore()


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
          state.value.title=state.value.boards[state.value.selected_board_row].name
        } catch (e) {
          console.error("==Error fetching boards:", e)
          state.value.error = e instanceof Error ? e.message : String(e)
        } finally {
          state.value.isLoading = false
        }
    }



    const moveTask=(fromTaskID:String, fromColumnId:String, toColumnId:String): void => {
      //console.log(fromTaskID, fromColumnId, toColumnId);
      const board_index=state.value.selected_board_row
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


// Alert
const ShowAlert=(text:String)=>{

  showConfirm(
    'alert','Warning.',text,
    () => { // onConfirm
    },
    () => {  //  onCancel
    }
  )
}

 // TASK

    const addNewTask = (columnId:String)=>{
      console.log('addNewTask');
      state.value.selected_task={...Task_new.value}
      state.value.title='New task'
      state.value.new_task=true
      router.push('/task')
      
    }

    const deleteTask=(taskId:String)=>{
      console.log('deleteTask');
      
      showConfirm(
        'delete','Warning','Are you sure you want to delete this task?',
        () => { 
          //onConfirm
          console.log('deleteTask from DB '+taskId);
        },
        () => {  
          //  onCancel
          console.log('Deletion canceled')
        }
      )

    }

    const  editTask =(column_row:number,task_row:number)=>{
      console.log('editTask');
      
      state.value.selected_task={...state.value.boards[state.value.selected_board_row].columns[column_row].tasks[task_row]}
      state.value.title='Edit task'
      state.value.new_task=false
      router.push('/task')

    }

  const cancelTask=()=>{
    state.value.title=state.value.boards[state.value.selected_board_row].name //'Board'
    router.push('/')
  }


    const sendUpdateTask = async (updatedData: any) => {

    }


    const saveTask =async()=>{
      console.log('saveTask to DB');

      try {
        
        let res = await $fetch('/api/task', {
          method: 'POST',
          body: JSON.stringify(state.value.selected_task) ,
        })

       console.log('==res',res);
       

        state.value.title=state.value.boards[state.value.selected_board_row].name //'Board'
        router.push('/')        
        
      } catch (error) {
        console.error(`==Error updating board: ${state.value.selected_boardId}`, error)
      }        

    }


    return { 
        state,
        addBoard,
        removeBoard,
        editBoardName,
        getBoard,
        moveTask,
        addNewTask,
        deleteTask,
        editTask,
        saveTask,
        cancelTask,
        ShowAlert,
    }
})