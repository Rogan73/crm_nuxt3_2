import { getFirestore, collection, doc, setDoc, getDoc,getDocs, addDoc,query, where, updateDoc, deleteDoc } from 'firebase/firestore';
//import { useRouter } from 'vue-router'


// interface authUser {
//   displayName: string | null;
//   email: string | null;
  
// }

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

// Получение задач для конкретной доски
const getBoardTasks = async (boardId) => {
  // console.log('getBoardTasks');
  
  // const tasksRef = collection(db, 'tasks', boardId);
  // const tasksSnapshot = await getDocs(tasksRef);
  // return tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  console.log('getBoardTasks for boardId:', boardId);
  
  const tasksRef = collection(db, 'tasks');
  const q = query(tasksRef, where("boardId", "==", boardId));
  const tasksSnapshot = await getDocs(q);
  return tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));


};

// Обновление задачи
const updateTask = async (boardId, taskId, taskData) => {
  const taskRef = doc(db, 'tasks', boardId, taskId);
  await updateDoc(taskRef, taskData);
};

// Добавление задачи
const addTask = async (boardId, columnId, taskData) => {
  
  console.log('addTask', boardId, columnId, taskData);
  
  try {
    const tasksRef = collection(db, 'tasks');
    const newTask = {
      ...taskData,
      boardId,  // привязка к доске
      columnId, // привязка к колонке
      createdAt: new Date(),
    };
    
    const docRef = await addDoc(tasksRef, newTask);
    
    console.log('Task added with ID:', docRef.id);
    
    
    return { id: docRef.id, ...newTask };
  } catch (error) {
    console.error('Error adding task:', error);
    throw error; // выбрасываем ошибку для обработки в вызывающем коде
  }
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




// Функция для добавления задачи в колонку col1 доски с ID "boardId1"
const addTaskToFirstColumn = async (boardId, newTask) => {
  const columnId = 'col1'; // ID первой колонки
  const tasksRef = collection(db, 'boards', boardId, 'columns', columnId, 'tasks');

  // Получаем все задачи и сортируем по полю order, чтобы найти максимальное значение
  const tasksQuery = query(tasksRef, orderBy('order', 'desc'));
  const querySnapshot = await getDocs(tasksQuery);

  let maxOrder = 0;
  querySnapshot.forEach((doc) => {
    const taskData = doc.data();
    if (taskData.order > maxOrder) {
      maxOrder = taskData.order;
    }
  });

  // Увеличиваем maxOrder на 1 для новой задачи
  const newOrder = maxOrder + 1;

  // Генерируем новый ID для задачи
  const newTaskId = `${Date.now()}`; // Можно использовать любое уникальное значение

  // Добавляем задачу с новым order
  const newTaskRef = doc(db, 'boards', boardId, 'columns', columnId, 'tasks', newTaskId);

  // Вставляем данные новой задачи
  await setDoc(newTaskRef, {
    ...newTask, // Переданные данные задачи
    order: newOrder, // Добавляем порядковый номер
  });

  console.log(`Задача добавлена в колонку ${columnId} с порядковым номером ${newOrder}`);
};




 return {
  authUser,
  columns,
  createBoard,
  getBoardTasks,
  updateTask,
  addTask,
  logout,
  addTaskToFirstColumn,
  fetchBoardData,
 }


})
