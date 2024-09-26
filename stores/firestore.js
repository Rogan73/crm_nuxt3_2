import { getFirestore, collection, doc, setDoc, getDoc,getDocs, addDoc,query, where, updateDoc, deleteDoc } from 'firebase/firestore';
//import { useRouter } from 'vue-router'

export const useFirestoreStore = defineStore("Firestore", () => {

const db = getFirestore();

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
    console.error('Error logging out:', error);
  }
}


 return {

  createBoard,
  getBoardTasks,
  updateTask,
  addTask,
  logout,
 }


})
