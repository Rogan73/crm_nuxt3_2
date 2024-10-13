import { defineStore } from "pinia"
import { ref } from "vue"
import type {Task,SelectedTaskRow,SelectedBoard } from '@/types/kanban2types'
import { useConfirmStore } from '@/stores/storeConfirm'
import { useFirestoreStore } from "@/stores/firestore"
import { useFirebase } from '@/composables/useFirebase'
import { useRouter } from 'vue-router'
import { fDateToYMD,fDateToDMY, fDateFromYMDToDMY } from '@/utils/dateUtils'



export const useKanban2Store = defineStore("kanban2", () => {

  

  const selectedBoard=ref<SelectedBoard>({boardId:'boardId1',boardName:'mainboard'})

  const FirestoreStore= useFirestoreStore()

  const showLeftPanel=ref(false)
  const current_page=ref('main')
  

  const   columns= ref<any>([])

  let sub2: (() => void) | undefined;

    // хук на изменения
    const { subscribeToDocument, subscribeToCollection } = useFirebase()

   
  


  // загрузка данных
  FirestoreStore.LoadBoardData().then(() => {

    selectedBoard.value={
      boardId:FirestoreStore.currentBoard.boardId,
      boardName:FirestoreStore.currentBoard.boardName
    }

    columns.value=FirestoreStore.columns

    watcher()
    
  })

 
// Подписка на данные доски

const watcher = ()=>{

// subscribeToDocument(`boards/${FirestoreStore.currentBoard.boardId}`, (data) => {
//   console.log('Received board data:', data)
//   //boardData.value = data
// })

// Подписка на колонки доски
sub2 = subscribeToCollection(`boards/${FirestoreStore.currentBoard.boardId}/columns`, (columns_) => {

  columns_.forEach(column => {
    subscribeToCollection(`boards/${FirestoreStore.currentBoard.boardId}/columns/${column.id}/tasks`, (tasks) => {
      if (startSee==false){
        start_update_board()
      }
  })
 })


})

}

//-----------------
const go_update_board=()=>{

    FirestoreStore.fetchBoardData(FirestoreStore.currentBoard.boardId).then(() => {
       columns.value=FirestoreStore.columns
  })  

}


const stop_update5s=()=>{

  if (btn_timer) {
    clearInterval(btn_timer);
    btn_timer = null; // Сбрасываем таймер для предотвращения возможных конфликтов
  }

}


   const flag_update5s=ref(false)
   let btn_timer_count=ref(0)
   let btn_timer: ReturnType<typeof setInterval> | null = null;

   const start_update_board=()=>{
    

       if (flag_update5s.value) return

       console.log('start_update_board');

       flag_update5s.value=true

          btn_timer_count.value=0

          btn_timer=setInterval( ()=>{
            btn_timer_count.value++
            if (btn_timer_count.value>5){
              btn_timer_count.value=0
              flag_update5s.value=false
              
              if (btn_timer) {
                clearInterval(btn_timer);
                btn_timer = null; // Сбрасываем таймер для предотвращения возможных конфликтов
              }

               go_update_board()

            }

          },1000)

       

          
   }





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


  const task:Task={
        title: "",
        date: fDateToYMD(new Date()) ,
        date_deadline: fDateToYMD(new Date()) ,
        type: "NEW",
        description: "",
        isOpen: false,
  }

  SelectedTaskRow.value.columnId=columnId;

  selectedTask.value={...task}
  titlePage.value='Add task'
  operation.value='AddTask'
  router.push('/task')

  
}


    const saveTask=()=>{
      //console.log('saveTask',operation.value)  // addTask / EditTask
      // selectedTask.value
      // selectedTaskRow.value

      if (selectedTask.value.title==''){
        ShowAlert('Task name cannot be empty')
        return
      }

     no_update()

      const FirestoreStore =  useFirestoreStore()
      if(operation.value=='AddTask'){
       // console.log('addTask')
       
        FirestoreStore.addTaskToColumn(selectedBoard.value.boardId,SelectedTaskRow.value.columnId,
          selectedTask.value
        //   {
        //   title: selectedTask.value.title,
        //   date: selectedTask.value.date,
        //   type: selectedTask.value.type,
        //   description: selectedTask.value.description
        // }
      ).then(()=>{
        router.push('/')
      })


      }
      if(operation.value=='EditTask'){
       // console.log('EditTask')

        const columnId=columns.value[SelectedTaskRow.value.columnRow].id
        const taskId=columns.value[SelectedTaskRow.value.columnRow].tasks[SelectedTaskRow.value.taskRow].id

        FirestoreStore.updateTask(selectedBoard.value.boardId,columnId,taskId,
          selectedTask.value
        //   {
        //   title: selectedTask.value.title,
        //   date: selectedTask.value.date,
        //   type: selectedTask.value.type,
        //   description: selectedTask.value.description,

        // }
      ).then(()=>{
          columns.value[SelectedTaskRow.value.columnRow].tasks[SelectedTaskRow.value.taskRow]=selectedTask.value    
          router.push('/')

        })

         

      }


    }


    const editTask=(task:Task,columnIndex:number,taskIndex:number)=>{
     // console.log('editTask',columnIndex,taskIndex)
      //startSee=true

      SelectedTaskRow.value.columnRow=columnIndex
      SelectedTaskRow.value.taskRow=taskIndex

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

          no_update()

          const FirestoreStore =  useFirestoreStore()

          const columnId=columns.value[SelectedTaskRow.value.columnRow].id
          const taskId=columns.value[SelectedTaskRow.value.columnRow].tasks[SelectedTaskRow.value.taskRow].id

          FirestoreStore.DeleteTask(selectedBoard.value.boardId,columnId,taskId).then(()=>{
            columns.value[SelectedTaskRow.value.columnRow].tasks.splice(SelectedTaskRow.value.taskRow,1)
          })

          

        },
        () => {  
          //  onCancel
          //console.log('Deletion canceled')
        }
      )

    }    

 

    const cancelTask=()=>{
      //console.log('cancelTask');
     //s startSee=false

      router.push('/')
    }


   const onTaskChange=(event: any,columnIndex:number)=>{

   // const { oldIndex, newIndex } = event;



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
let addColumnId: number
let startSee: boolean = false


const set_startSee=(val: boolean)=>{
  startSee = val
  //console.log('startSee',startSee);
}

const no_update=()=>{
  
  startSee = true

  setTimeout(() => {
    startSee = false
    //console.log('start   ',startSee);
  },2000);
  
}

no_update()



const seeChange=async (event: any, columnIndex:number)=>{
  //console.log('seeChange',event, col)
  startSee = true
  //console.log('startSee',startSee);

  setTimeout(() => {
    startSee = false
    //console.log('startSee',startSee);
  },2500);

  if (event.added) {
    const addedTask = event.added.element;
    const newTaskIndex = event.added.newIndex;

    addednewTaskIndex = event.added.newIndex;
    addedColumnIndex = columnIndex
    addColumnId = columns.value[columnIndex].id

   // console.log(`Задача добавлена в колонку ${columns.value[columnIndex].id} на индекс ${newTaskIndex}`);
    
   //обновить 


    // Обновляем базу данных, перемещая задачу в новую колонку
    //await kanban2Store.addTaskToColumn(columnIndex, addedTask, newTaskIndex);
  }


  if (event.removed) {
    const removedTask = event.removed.element;
    const oldTaskIndex = event.removed.oldIndex;

  //  console.log(`Задача удалена из колонки ${columns.value[columnIndex].id} с индекса ${oldTaskIndex}`);
    

   let columnId=columns.value[columnIndex].id

    // Удаляем задачу из старой колонки
    await FirestoreStore.moveTaskFromColumnToColumn(selectedBoard.value.boardId, columnId, addColumnId, removedTask.id);
     // для всех tasks обновить order_index

     //console.log('sorting old column');
     
     columns.value[columnIndex].tasks.forEach( async(task:any,index:number)=>{

      await  FirestoreStore.updateTaskOrderInColumn(selectedBoard.value.boardId,columnId,task.id,index)
     })

    
 //    console.log('sorting new column');
     columnId=columns.value[addedColumnIndex].id
     columns.value[addedColumnIndex].tasks.forEach( async(task:any,index:number)=>{
      await FirestoreStore.updateTaskOrderInColumn(selectedBoard.value.boardId,columnId,task.id,index)
    })

    //console.log('end sorting');


   
  }

  if (event.moved) {
   // console.log('Колонка не изменилась',event.moved.oldIndex,event.moved.newIndex);
    // обновить order_index для колокни columnIndex
    const columnId=columns.value[columnIndex].id
    // для всех tasks обновить order_index

    columns.value[columnIndex].tasks.forEach(async (task:any,index:number)=>{
      await FirestoreStore.updateTaskOrderInColumn(selectedBoard.value.boardId, columnId,task.id,index)
    })


  }


  //startSee=false
  //console.log('startSee',startSee);
  

}


// async function updateTaskInFirestore(task: Task) {
//   const taskRef = firestore.collection('tasks').doc(task.id);
//   await taskRef.update({
//     order_index: task.order_index
//   });
// }


const goTo=(page:string)=>{
  showLeftPanel.value = false
  current_page.value = page

  if (page == 'main') page=''

  router.push(`/${page}`)
}


    return{
      
        columns,
        selectedBoard,
        SelectedTaskRow,
        selectedTask,
        titlePage,
        operation,
        flag_update5s,
        btn_timer_count,
        showLeftPanel,
        current_page,
        addTask,
        editTask,
        deleteTask,
        saveTask,
        cancelTask,
        onTaskChange,
        ShowAlert,
        onTaskStart,
        onTaskEnd,
        seeChange,
        set_startSee,
        stop_update5s,
        go_update_board,
        goTo,


    }
})