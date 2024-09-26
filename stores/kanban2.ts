import { defineStore } from "pinia"
import { ref } from "vue"
import type {Task,SelectedTaskRow } from '@/types/kanban2types'
import { useConfirmStore } from '@/stores/storeConfirm'
import { useFirestoreStore } from "@/stores/firestore"
import { useRouter } from 'vue-router'


export const useKanban2Store = defineStore("kanban2", () => {




    const   columns= ref([
        {
          id: 'col1',
          title: "Backlog",
          tasks: [
            {
              id: 1,
              title: "Add discount code to checkout page",
              date: "Sep 14",
              type: "Feature Request",
              description: "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
              isOpen: false
            },
            {
              id: 2,
              title: "Provide documentation on integrations",
              date: "Sep 12"
              
            },
            {
              id: 3,
              title: "Design shopping cart dropdown",
              date: "Sep 9",
              type: "Design"
            },
            {
              id: 4,
              title: "Add discount code to checkout page",
              date: "Sep 14",
              type: "Feature Request"
            },
            {
              id: 5,
              title: "Test checkout flow",
              date: "Sep 15",
              type: "QA"
            }
          ]
        },
        {
          id: 'col2',
          title: "In Progress",
          tasks: [
            {
              id: 6,
              title: "Design shopping cart dropdown",
              date: "Sep 9",
              type: "Design"
            },
            {
              id: 7,
              title: "Add discount code to checkout page",
              date: "Sep 14",
              type: "Feature Request"
            },
            {
              id: 8,
              title: "Provide documentation on integrations",
              date: "Sep 12",
              type: "Backend"
            }
          ]
        },
        {
          id: 'col3',
          title: "Review",
          tasks: [
            {
              id: 9,
              title: "Provide documentation on integrations",
              date: "Sep 12"
            },
            {
              id: 10,
              title: "Design shopping cart dropdown",
              date: "Sep 9",
              type: "Design"
            },
            {
              id: 11,
              title: "Add discount code to checkout page",
              date: "Sep 14",
              type: "Feature Request"
            },
            {
              id: 12,
              title: "Design shopping cart dropdown",
              date: "Sep 9",
              type: "Design"
            },
            {
              id: 13,
              title: "Add discount code to checkout page",
              date: "Sep 14",
              type: "Feature Request"
            }
          ]
        },
        {
          id: 'col4',
          title: "Done",
          tasks: [
            {
              id: 14,
              title: "Add discount code to checkout page",
              date: "Sep 14",
              type: "Feature Request"
            },
            {
              id: 15,
              title: "Design shopping cart dropdown",
              date: "Sep 9",
              type: "Design"
            },
            {
              id: 16,
              title: "Add discount code to checkout page",
              date: "Sep 14",
              type: "Feature Request"
            }
          ]
        }
      ]

    )

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

  const { addTask } =  useFirestoreStore()
 

  addTask('boardId1',columnId,{
    title: "Add discount code to checkout page",
    description: "lorem ipsum dolor sit amet...",
    order: 1,
    date: "2024-09-14",
    columnId: "columnId1",
    type: "Feature Request"
  })

  // console.log('addNewTask');
  // state.value.selected_task={...Task_new.value}
  // state.value.selected_task.id_board=state.value.boards[state.value.selected_board_row].id
  // state.value.selected_task.id_column=Number(columnId) 
  // state.value.selected_task.id_person=1 // для проверки
  // state.value.title='New task'
  // state.value.new_task=true
  // router.push('/task')
  
}


    const editTask=(task:Task)=>{
      console.log(task.id)

      selectedTask.value={...task}
      titlePage.value='Edit task'
      operation.value='EditTask'
      router.push('/task')


    }



    const deleteFormDB=async(endpoint:String,table:String,id:String)=>{

      console.log('delete id from DB '+table);

      const  body=JSON.stringify({
        table,
        id,
        action: 'delete'
      })

      try {
        
        let res = await $fetch(`/api/${endpoint}`, {
          method: 'POST',
          body,
        })
        
        // редактировать локально или перегрузить или дождаться команды от WinSocket о перегрузке
       

      } catch (error) {
        console.error(`🔴Error deleting ${id}`, error)
      }  
    }


    const deleteTask=(task:Task)=>{

      console.log('deleteTask',task.id);
      
      showConfirm(
        'delete','Warning','Are you sure you want to delete this task?',
        async() => { 
          //onConfirm
          
        //  await  deleteFormDB('task','tasks',String(task.id))
          
          columns.value[SelectedTaskRow.value.columnRow].tasks.splice(SelectedTaskRow.value.taskRow,1)

        },
        () => {  
          //  onCancel
          console.log('Deletion canceled')
        }
      )

    }    

    const saveTask=()=>{
      console.log('saveTask');
    }
   

    const cancelTask=()=>{
      console.log('cancelTask');
      router.push('/')
    }

    return{
      
        columns,
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