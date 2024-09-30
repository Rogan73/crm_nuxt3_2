import { defineStore } from "pinia"
import { ref } from "vue"
import type {Task,SelectedTaskRow,SelectedBoard } from '@/types/kanban2types'
import { useConfirmStore } from '@/stores/storeConfirm'
import { useFirestoreStore } from "@/stores/firestore"
import { useRouter } from 'vue-router'


export const useKanban2Store = defineStore("kanban2", () => {

  

  const selectedBoard=ref<SelectedBoard>({boardId:'boardId1',boardName:'mainboard'})

  const FirestoreStore= useFirestoreStore()
  const   columns= ref<any[]>([])

  
  FirestoreStore.LoadBoardData().then(() => {

    selectedBoard.value={
      boardId:FirestoreStore.currentBoard.boardId,
      boardName:FirestoreStore.currentBoard.boardName
    }

    columns.value=FirestoreStore.columns
    
  })



  // FirestoreStore.fetchBoardData(selectedBoard.value.boardId).then((data:any) => {

  //  columns.value = data

  // }) 

  
  

    // const   columns= ref([
    //     {
    //       id: 'col1',
    //       title: "Backlog",
    //       tasks: [
    //         {
    //           id: 1,
    //           title: "Add discount code to checkout page",
    //           date: "Sep 14",
    //           type: "Feature Request",
    //           description: "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    //           isOpen: false
    //         },
    //         {
    //           id: 2,
    //           title: "Provide documentation on integrations",
    //           date: "Sep 12"
              
    //         },
    //         {
    //           id: 3,
    //           title: "Design shopping cart dropdown",
    //           date: "Sep 9",
    //           type: "Design"
    //         },
    //         {
    //           id: 4,
    //           title: "Add discount code to checkout page",
    //           date: "Sep 14",
    //           type: "Feature Request"
    //         },
    //         {
    //           id: 5,
    //           title: "Test checkout flow",
    //           date: "Sep 15",
    //           type: "QA"
    //         }
    //       ]
    //     },
    //     {
    //       id: 'col2',
    //       title: "In Progress",
    //       tasks: [
    //         {
    //           id: 6,
    //           title: "Design shopping cart dropdown",
    //           date: "Sep 9",
    //           type: "Design"
    //         },
    //         {
    //           id: 7,
    //           title: "Add discount code to checkout page",
    //           date: "Sep 14",
    //           type: "Feature Request"
    //         },
    //         {
    //           id: 8,
    //           title: "Provide documentation on integrations",
    //           date: "Sep 12",
    //           type: "Backend"
    //         }
    //       ]
    //     },
    //     {
    //       id: 'col3',
    //       title: "Review",
    //       tasks: [
    //         {
    //           id: 9,
    //           title: "Provide documentation on integrations",
    //           date: "Sep 12"
    //         },
    //         {
    //           id: 10,
    //           title: "Design shopping cart dropdown",
    //           date: "Sep 9",
    //           type: "Design"
    //         },
    //         {
    //           id: 11,
    //           title: "Add discount code to checkout page",
    //           date: "Sep 14",
    //           type: "Feature Request"
    //         },
    //         {
    //           id: 12,
    //           title: "Design shopping cart dropdown",
    //           date: "Sep 9",
    //           type: "Design"
    //         },
    //         {
    //           id: 13,
    //           title: "Add discount code to checkout page",
    //           date: "Sep 14",
    //           type: "Feature Request"
    //         }
    //       ]
    //     },
    //     {
    //       id: 'col4',
    //       title: "Done",
    //       tasks: [
    //         {
    //           id: 14,
    //           title: "Add discount code to checkout page",
    //           date: "Sep 14",
    //           type: "Feature Request"
    //         },
    //         {
    //           id: 15,
    //           title: "Design shopping cart dropdown",
    //           date: "Sep 9",
    //           type: "Design"
    //         },
    //         {
    //           id: 16,
    //           title: "Add discount code to checkout page",
    //           date: "Sep 14",
    //           type: "Feature Request"
    //         }
    //       ]
    //     }
    //   ]

    // )

    const router = useRouter()

  
    const SelectedTaskRow=ref<SelectedTaskRow>({columnRow:-1,taskRow:-1})
    const selectedTask=ref<Task>({} as Task)
    const titlePage=ref<String>('')
    const operation=ref<String>('')

// Alert

const { showConfirm } = useConfirmStore()
const ShowAlert=(text:String)=>{

  showConfirm(
    'alert','Warning.',text,
    () => { // onConfirm
    },
    () => {  //  onCancel
    }
  )
}

// Task

const addTask = (columnId:string)=>{

  const { addTaskToColumn  } =  useFirestoreStore()
  
  addTaskToColumn(selectedBoard.value.boardId,columnId,{
    
      title: "--New task title--",
      date: "--Sep 28--",
      type: "--Feature Request--",
      description: "--Task description--",
      isOpen: false,
    
  })
  
}


    const saveTask=()=>{
      console.log('saveTask',operation.value)  // addTask / EditTask
      // selectedTask.value
      // selectedTaskRow.value
      const FirestoreStore =  useFirestoreStore()
      if(operation.value=='addTask'){
        console.log('addTask')
        FirestoreStore.addTaskToColumn(selectedBoard.value.boardId,SelectedTaskRow.value.columnRow,{
          title: selectedTask.value.title,
          date: selectedTask.value.date,
          type: selectedTask.value.type,
          description: selectedTask.value.description,
          isOpen: selectedTask.value.isOpen,
        })
      }
      if(operation.value=='EditTask'){
        console.log('EditTask')
        FirestoreStore.updateTask(selectedBoard.value.boardId,SelectedTaskRow.value.columnRow,SelectedTaskRow.value.taskRow,{
          title: selectedTask.value.title,
          date: selectedTask.value.date,
          type: selectedTask.value.type,
          description: selectedTask.value.description,
          isOpen: selectedTask.value.isOpen,
        })
      }


    }


    const editTask=(task:Task,columnIndex:number,taskIndex:number)=>{
      console.log('editTask',columnIndex,taskIndex)

      selectedTask.value={...task}
      titlePage.value='Edit task'
      operation.value='EditTask'
      router.push('/task')


    }



  


    const deleteTask=(columnIndex:number,taskIndex:number)=>{

      console.log('deleteTask',columnIndex,taskIndex);

      SelectedTaskRow.value.columnRow=columnIndex
      SelectedTaskRow.value.taskRow=taskIndex
      
      showConfirm(
        'delete','Warning','Are you sure you want to delete this task?',
        async() => { 
          //onConfirm
          
        //  await  deleteFormDB('task','tasks',String(task.id))
          //console.log('SelectedTaskRow.value.columnRow',SelectedTaskRow.value.columnRow);
          //console.log('SelectedTaskRow.value.taskRow',SelectedTaskRow.value.taskRow);
          
          columns.value[SelectedTaskRow.value.columnRow].tasks.splice(SelectedTaskRow.value.taskRow,1)

        },
        () => {  
          //  onCancel
          console.log('Deletion canceled')
        }
      )

    }    

 

    const cancelTask=()=>{
      console.log('cancelTask');
      router.push('/')
    }

    return{
      
        columns,
        selectedBoard,
        SelectedTaskRow,
        selectedTask,
        titlePage,
        operation,
        addTask,
        editTask,
        deleteTask,
        saveTask,
        cancelTask,
        ShowAlert,


    }
})