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
          description: selectedTask.value.description
        })
      }
      if(operation.value=='EditTask'){
        console.log('EditTask')

        const columnId=columns.value[SelectedTaskRow.value.columnRow].id
        const taskId=columns.value[SelectedTaskRow.value.columnRow].tasks[SelectedTaskRow.value.taskRow].id

        FirestoreStore.updateTask(selectedBoard.value.boardId,columnId,taskId,{
          title: selectedTask.value.title,
          date: selectedTask.value.date,
          type: selectedTask.value.type,
          description: selectedTask.value.description,
        }).then(()=>{
          columns.value[SelectedTaskRow.value.columnRow].tasks[SelectedTaskRow.value.taskRow]=selectedTask.value    
          router.push('/')

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

      SelectedTaskRow.value.columnRow=columnIndex
      SelectedTaskRow.value.taskRow=taskIndex
      
      showConfirm(
        'delete','Warning','Are you sure you want to delete this task?',
        async() => { 
          //onConfirm

          const FirestoreStore =  useFirestoreStore()

          const columnId=columns.value[SelectedTaskRow.value.columnRow].id
          const taskId=columns.value[SelectedTaskRow.value.columnRow].tasks[SelectedTaskRow.value.taskRow].id

          FirestoreStore.DeleteTask(selectedBoard.value.boardId,columnId,taskId).then(()=>{
            columns.value[SelectedTaskRow.value.columnRow].tasks.splice(SelectedTaskRow.value.taskRow,1)
          })

          

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


   const onTaskChange=(event: any,columnIndex:number)=>{

    const { oldIndex, newIndex } = event;

    console.log('oldIndex',oldIndex,'newIndex',newIndex,'columnIndex',columnIndex);
    

    //console.log(`Задача перемещена внутри колонки ${kanban2Store.columns[columnIndex].title}`);
    //updateTaskOrderInColumn(columnIndex, event.items);

    // Обновление порядка задач, если они изменились местами
/*     if (oldIndex !== newIndex) {
      await this.updateTaskOrder();
    } */

   }


  const onTaskStart=(event: any,columnIndex:number)=>{
    const { oldIndex, newIndex } = event;
    console.log('onTaskStart',oldIndex,newIndex)
  }

  const onTaskEnd=(event: any,columnIndex:number)=>{
    const { oldIndex, newIndex } = event;
    console.log('onTaskEnd','oldIndex',oldIndex,'newIndex',newIndex,'columnIndex',columnIndex)
    console.log('event',event);

// Получаем новую колонку через event.to
const newColumnElement = event.to; 
const newColumnIndex = Array.from(newColumnElement.parentNode.children).indexOf(newColumnElement);
console.log('newColumnIndex',newColumnIndex);


    
  }


let addednewTaskIndex : number
let addedColumnIndex: number

const seeChange=(event: any, columnIndex:number)=>{
  //console.log('seeChange',event, col)

  if (event.added) {
    const addedTask = event.added.element;
    const newTaskIndex = event.added.newIndex;

    addednewTaskIndex = event.added.newIndex;
    addedColumnIndex = columnIndex

    console.log(`Задача добавлена в колонку ${columns.value[columnIndex].id} на индекс ${newTaskIndex}`);
    
   //обновить 


    // Обновляем базу данных, перемещая задачу в новую колонку
    //await kanban2Store.addTaskToColumn(columnIndex, addedTask, newTaskIndex);
  }


  if (event.removed) {
    const removedTask = event.removed.element;
    const oldTaskIndex = event.removed.oldIndex;

    console.log(`Задача удалена из колонки ${columns.value[columnIndex].id} с индекса ${oldTaskIndex}`);
    
   // по завершению сначала будет added затем removed  если колонка меняется
   // надо обновить order_index для исходной колонки для всех всех задач в этой колонке 
   // потом и обновить order_index для новой колонки для всех всех задач в этой колонке

   // удалить из старой колоки
   // добавить в новую колонку
   // обновить order_index для всех задач в этой колонке
   // обновить order_index для всех задач в новой колонке
    let columnId=columns.value[columnIndex].id

     // для всех tasks обновить order_index

     columns.value[columnIndex].tasks.forEach((task:any,index:number)=>{
       FirestoreStore.updateTaskOrderInColumn(columnId,task.id,index)
     })

     columnId=columns.value[addedColumnIndex].id
     columns.value[addedColumnIndex].tasks.forEach((task:any,index:number)=>{
      FirestoreStore.updateTaskOrderInColumn(columnId,task.id,index)
    })




    // Удаляем задачу из старой колонки
    //await kanban2Store.removeTaskFromColumn(columnIndex, removedTask);
  }

  if (event.moved) {
    console.log('Колонка не изменилась',event.moved.oldIndex,event.moved.newIndex);
    // обновить order_index для колокни columnIndex
    const columnId=columns.value[columnIndex].id
    // для всех tasks обновить order_index

    columns.value[columnIndex].tasks.forEach((task:any,index:number)=>{
      FirestoreStore.updateTaskOrderInColumn(columnId,task.id,index)
    })


  }

}


// async function updateTaskInFirestore(task: Task) {
//   const taskRef = firestore.collection('tasks').doc(task.id);
//   await taskRef.update({
//     order_index: task.order_index
//   });
// }


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
        onTaskChange,
        ShowAlert,
        onTaskStart,
        onTaskEnd,
        seeChange


    }
})