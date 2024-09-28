import { getFirestore, collection, doc, setDoc, getDoc,getDocs, addDoc,query, where, updateDoc, deleteDoc } from 'firebase/firestore';


export const useFirestoreStore = defineStore("Firestore", () => {

const db = getFirestore();

const authUser=ref({displayName: '', email: ''})

const columns=ref([])


// Создание новой доски
const createBoard = async (boardData) => {
  const newBoardRef = doc(collection(db, 'boards'));
  await setDoc(newBoardRef, boardData);
  return newBoardRef.id;
};








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
        return {
          id: columnDoc.id,
          title: columnDoc.data().title,
          tasks: tasksData,
        };
      })
    );

    columns.value = columnsData;

    console.log(columns.value);
    

  } else {
    console.log("No such board!");
  }

  return columns.value;
  

};


const addTaskToColumn = async (boardId, columnId, taskData) => {
  try {
    // Ссылка на коллекцию задач внутри конкретной колонки
    const columnRef = doc(db, 'boards', boardId, 'columns', columnId);
    const tasksCollectionRef = collection(columnRef, 'tasks');
    // Добавление новой задачи в коллекцию tasks
    const newTaskRef = await addDoc(tasksCollectionRef, taskData);

    // Добавление в локальный массив   
    const columnIndex = columns.value.findIndex(column => column.id === columnId); 
    columns.value[columnIndex].tasks.push({
      id: newTaskRef.id,
      ...taskData
    })

    console.log(`Задача добавлена с ID: ${newTaskRef.id}`);
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
    console.log(`Задача с ID ${taskId} обновлена`);
  } catch (error) {
    console.error("Ошибка при обновлении задачи: ", error);
  }
};




 return {
  authUser,
  columns,
  createBoard,
  logout,
  addTaskToColumn,
  updateTask,
  fetchBoardData,
 }


})
