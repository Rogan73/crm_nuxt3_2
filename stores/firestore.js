import { getFirestore, collection, doc, setDoc, getDoc,getDocs, addDoc,query, where, updateDoc, deleteDoc } from 'firebase/firestore';
import {useKanban2Store} from '@/stores/kanban2'
import { useLists } from '@/composables/useLists'



export const useFirestoreStore = defineStore("Firestore", () => {

const db = getFirestore();

const { fetchAllLists } = useLists()

const authUser=ref({displayName: '', email: ''})



const boards=ref([])
const columns=ref([])
const currentBoard=ref({boardId:'',boardName:''})

const d_types=ref([])
const d_personas=ref([])
const d_professions=ref([])

// Создание новой доски
const createBoard = async (boardData) => {
  const newBoardRef = doc(collection(db, 'boards'));
  await setDoc(newBoardRef, boardData);
  return newBoardRef.id;
};



// Получение ссылки на коллекцию types items
const typesItemsRef = collection(db, 'lists', 'types', 'items');

const professionsItemsRef = collection(db, 'lists', 'professions', 'items');

const personasItemsRef = collection(db, 'lists', 'personas', 'items');




const logout = async () => {
  const { $authFB } = useNuxtApp(); 
  
  try {
    
    await $authFB.signOut(); // Вызов функции выхода
    const router = useRouter()
    router.push('/login'); // После выхода перенаправляем на страницу /login
    console.log('Logged out successfully');
    
  } catch (error) {
    console.log('Error logging out:', error);
  }
}


// НОВЫЕ ФУНКЦИИ ==============================

const fetchBoards = async () => {
  try {

  const boardRef = collection(db, 'boards')
  const boardSnap = await getDocs(boardRef)

  boards.value = boardSnap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
  //console.log('boards', boards.value);



} catch (error) {
    console.error('Error fetching boards:', error)
  }
   
}



const LoadBoardData = async () => {
   
  await fetchBoards() 

    fetchAllLists().then(({ types, personas, professions }) => {
     d_types.value=types
     d_personas.value=personas
     d_professions.value=professions
     //console.log('d_types', d_types.value);
     //console.log('d_personas', d_personas.value);
     //console.log('d_professions', d_professions.value);
    })

 

    if (localStorage.currentBoard){
      currentBoard.value=JSON.parse(localStorage.currentBoard)

      //console.log('currentBoard localStorage',currentBoard.value);
      

      }else{
        currentBoard.value= {
          boardId: boards.value[0].id,
          boardName: boards.value[0].title
       }

       //console.log('currentBoard =',currentBoard.value);

       localStorage.currentBoard = JSON.stringify(currentBoard.value)
      }

      
    
   await fetchBoardData(currentBoard.value.boardId)
    
  
   

}



const fetchBoardData = async (boardId) => {
  const boardRef = doc(db, 'boards', boardId);
  const boardSnap = await getDoc(boardRef);

  if (boardSnap.exists()) {
    const columnsSnap = await getDocs(collection(boardRef, 'columns'));

    const columnsData = await Promise.all(
      columnsSnap.docs.map(async (columnDoc) => {
        const tasksSnap = await getDocs(collection(columnDoc.ref, 'tasks'));
        const tasksData = tasksSnap.docs.map((taskDoc) => ({
          id: taskDoc.id,
          ...taskDoc.data()
        }));
        tasksData.forEach((task) => {
          task.isOpen = false;
        })
        return {
          id: columnDoc.id,
          title: columnDoc.data().title,
          tasks: tasksData,
        };
      })
    );

    // сорировать в columnsData все tasks по полю order_index если оно есть
    columnsData.forEach((column) => {
      column.tasks.sort((a, b) => a.order_index - b.order_index);
    });
    

    columns.value = columnsData;

   // console.log(columns.value);
    

  } else {
    console.log("No such board!");
  }

  return columns.value;
  

};

const changeBoard=(boardId)=>{
  //console.log(1);
  
  const boardRow=boards.value.findIndex(board=>board.id==boardId)
  //console.log(2,boardRow);
  currentBoard.value= {
    boardId: boards.value[boardRow].id,
    boardName: boards.value[boardRow].title
 }
  const Kanban2Store=useKanban2Store()
  Kanban2Store.selectedBoard={
    boardId: boards.value[boardRow].id,
    boardName: boards.value[boardRow].title
  }

  localStorage.currentBoard = JSON.stringify(currentBoard.value)
 //console.log('currentBoard.value.boardId',currentBoard.value.boardId);


  fetchBoardData(currentBoard.value.boardId).then(()=>{

    Kanban2Store.columns=columns.value

  })
  
  

}



//  TASK

const addTaskToColumn = async (boardId, columnId, taskData) => {
  try {
    // Ссылка на коллекцию задач внутри конкретной колонки
    console.log('0',boardId,columnId)

    const columnRef = doc(db, 'boards', boardId, 'columns', columnId);

    console.log('01')

    const tasksCollectionRef = collection(columnRef, 'tasks');

    console.log('02')

    // Добавление новой задачи в коллекцию tasks
    const newTaskRef = await addDoc(tasksCollectionRef, taskData);

    console.log('1')

    // Добавление в локальный массив   
    const columnIndex = columns.value.findIndex(column => column.id === columnId); 
    console.log('2')
    columns.value[columnIndex].tasks.push({
      id: newTaskRef.id,
      ...taskData
    })

    console.log('3')

    //console.log(`Задача добавлена с ID: ${newTaskRef.id}`);
  } catch (error) {
    console.error("Ошибка при добавлении задачи: ", error);
  }
};


const updateTask = async (boardId, columnId, taskId, updatedTaskData) => {
  try {
    // Ссылка на коллекцию задач внутри конкретной колонки
    const columnRef = doc(db, 'boards', boardId, 'columns', columnId);
    const tasksCollectionRef = collection(columnRef, 'tasks');
    // Ссылка на конкре
    const taskRef = doc(tasksCollectionRef, taskId);
    // Обновление задачи
    await updateDoc(taskRef, updatedTaskData);
    //console.log(`Задача с ID ${taskId} обновлена`);
  } catch (error) {
    console.error("Ошибка при обновлении задачи: ", error);
  }
};

 const DeleteTask=async(boardId, columnId, taskId)=>{
  try {
    // Ссылка на коллекцию задач внутри конкретной колонки
    const columnRef = doc(db, 'boards', boardId, 'columns', columnId);
    const tasksCollectionRef = collection(columnRef, 'tasks');
    // Ссылка на конкре
    const taskRef = doc(tasksCollectionRef, taskId);
    // Обновление задачи
    await deleteDoc(taskRef);
    //console.log(`Задача с ID ${taskId} удалена`);
  } catch (error) {
    console.error("Ошибка при обновлении задачи: ", error);
  }

 }

 const updateTaskOrderInColumn=async(boardId,columnId,taskId,Index)=>{
  try {
    // Ссылка на документ board
    const boardDocRef = doc(db, 'boards', boardId);
    
    // Ссылка на коллекцию columns внутри документа board
    const columnsCollectionRef = collection(boardDocRef, 'columns');
    
    // Ссылка на конкретную колонку
    const columnDocRef = doc(columnsCollectionRef, columnId);
    
    // Ссылка на коллекцию задач внутри конкретной колонки
    const tasksCollectionRef = collection(columnDocRef, 'tasks');
    
    // Ссылка на конкретную задачу
    const taskDocRef = doc(tasksCollectionRef, taskId);

    // Обновление задачи
    await updateDoc(taskDocRef, {
      order_index: Index
    });
    
  } catch (error) {
    console.error("Ошибка при обновлении order_index: ", error);
  }


 }





const moveTaskFromColumnToColumn = async (boardId, sourceColumnId, destinationColumnId, taskId) => {
  // Получаем задачу из исходной колонки
  const taskRef = doc(db, 'boards', boardId, 'columns', sourceColumnId, 'tasks', taskId);

  const taskDoc = await getDoc(taskRef);
  
  if (taskDoc.exists()) {
    const taskData = taskDoc.data();
    //console.log('Задача найдена:', taskData);
    
    // Создаем задачу в целевой колонке
    const newTaskRef = doc(db, 'boards', boardId, 'columns', destinationColumnId, 'tasks', taskId);
    await setDoc(newTaskRef, taskData);
    //console.log('Задача успешно перемещена в новую колонку');

    // Удаляем задачу из старой колонки
    await deleteDoc(taskRef);
    //console.log('Задача удалена из старой колонки');
  } else {
    //console.log('Задача не найдена в исходной колонке.');
  }
};




 return {
  authUser,
  columns,
  currentBoard,
  boards,
  d_types,
  d_personas,
  d_professions,
  createBoard,
  logout,
  addTaskToColumn,
  DeleteTask,
  updateTask,
  LoadBoardData,
  fetchBoardData,
  fetchBoards,
  changeBoard,
  updateTaskOrderInColumn,
  moveTaskFromColumnToColumn,
 }


})
