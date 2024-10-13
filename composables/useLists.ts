import { getFirestore, collection, doc, setDoc, getDoc,getDocs, addDoc,query, where, updateDoc, deleteDoc } from 'firebase/firestore';

export const useLists=() => {
//import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Инициализация Firestore
const db = getFirestore();

// Ссылки на коллекции Firestore
const typesItemsRef = collection(db, 'lists', 'types', 'items');
const professionsItemsRef = collection(db, 'lists', 'professions', 'items');
const personasItemsRef = collection(db, 'lists', 'personas', 'items');

// Функции для получения данных из Firestore
const fetchTypes = async () => {
  try {
    const snapshot = await getDocs(typesItemsRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.log('🔴 Error fetching types:', error);
    return []; // Вернуть пустой массив в случае ошибки
  }
};

const fetchPersonas = async () => {
  try {
    const personasSnap = await getDocs(personasItemsRef);
    return personasSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.log('🔴 Error fetching personas:', error);
    return [];
  }
};

const fetchProfessions = async () => {
  try {
    const professionsSnap = await getDocs(professionsItemsRef);
    return professionsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.log('🔴 Error fetching professions:', error);
    return [];
  }
};

// Функция для получения всех данных
 const fetchAllLists = async () => {
  try {
    const [types, personas, professions] = await Promise.all([
      fetchTypes(),
      fetchPersonas(),
      fetchProfessions()
    ]);
    //console.log('✅ All lists fetched successfully');
    return {
      types,
      personas,
      professions
    };
  } catch (error) {
    console.log('🔴 Error fetching all lists:', error);
    return {
      types: [],
      personas: [],
      professions: []
    };
  }
};

//ADD NEW ===============================================

// Функция для добавления нового типа
 const addNewType = async (newType:any) => {
  try {
    const newTypeRef = await addDoc(typesItemsRef, newType);
    return newTypeRef.id;
  } catch (error) {
    console.log('🔴 Error adding new type:', error);
    return null;
  }
};
// Функция для добавления новой профессии
 const addNewProfession = async (newProfession:any) => {
  try {
    const newProfessionRef = await addDoc(professionsItemsRef, newProfession);
    return newProfessionRef.id;
  } catch (error) {
    console.log('🔴 Error adding new profession:', error);
    return null;
  }
};
// Функция для добавления новой личности
 const addNewPersona = async (newPersona:any) => {
  try {
    const newPersonaRef = await addDoc(personasItemsRef, newPersona);
    return newPersonaRef.id;
  } catch (error) {
    console.log('🔴 Error adding new persona:', error);
    return null;
  }
};

//UPDATE ===============================================

// Функция для обновления типа
 const updateType = async (typeId:any, updatedType:any) => {
  try {
    const typeRef = doc(typesItemsRef, typeId);
    await updateDoc(typeRef, updatedType);
    return true;
  } catch (error) {
    console.log('🔴 Error updating type:', error);
    return false;
  }
};
// Функция для обновления профессии
 const updateProfession = async (professionId:any, updatedProfession:any) => {
  try {
    const professionRef = doc(professionsItemsRef, professionId);
    await updateDoc(professionRef, updatedProfession);
    return true;
  } catch (error) {
    console.log('🔴 Error updating profession:', error);
    return false;
  }
};

// Функция для обновления личности
 const updatePersona = async (personaId:any, updatedPersona:any) => {
  try {
    const personaRef = doc(personasItemsRef, personaId);
    await updateDoc(personaRef, updatedPersona);
    return true;
  } catch (error) {
    console.log('🔴 Error updating persona:', error);
    return false;
  }
};

//DELETE  ===============================================

// Функция для удаления типа
 const deleteType = async (typeId:any) => {
  try {
    const typeRef = doc(typesItemsRef, typeId);
    await deleteDoc(typeRef);
    return true;
  } catch (error) {
    console.log('🔴 Error deleting type:', error);
    return false;
  }
};

// Функция для удаления профессии
 const deleteProfession = async (professionId:any) => {
  try {
    const professionRef = doc(professionsItemsRef, professionId);
    await deleteDoc(professionRef);
    return true;
  } catch (error) {
    console.log('🔴 Error deleting profession:', error);
    return false;
  }
};

// Функция для удаления личности
 const deletePersona = async (personaId:any) => {
  try {
    const personaRef = doc(personasItemsRef, personaId);
    await deleteDoc(personaRef);
    return true;
  } catch (error) {
    console.log('🔴 Error deleting persona:', error);
    return false;
  }
};

 return {
    addNewType,
    addNewProfession,
    addNewPersona,
    updateType,
    updateProfession,
    updatePersona,
    deleteType,
    deleteProfession,
    deletePersona,
    fetchAllLists
 }

}