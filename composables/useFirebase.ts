import { ref, onUnmounted } from 'vue'
import { getFirestore, collection, doc, onSnapshot, QuerySnapshot, DocumentSnapshot } from 'firebase/firestore'

export function useFirebase() {
  const db = getFirestore()

  const subscribeToCollection = (path: string, callback: (data: any[]) => void) => {
    //console.log(`Subscribing to collection: ${path}`)
    const collectionRef = collection(db, path)
    
    const unsubscribe = onSnapshot(collectionRef, (snapshot: QuerySnapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      //console.log(`Received data for collection ${path}:`, data)
      callback(data)
    }, (error) => {
      console.error(`Error subscribing to collection ${path}:`, error)
    })

    // onUnmounted(() => {
    //   console.log(`Unsubscribing from collection: ${path}`)
    //   unsubscribe()
    // })

    return unsubscribe
  }

  const subscribeToDocument = (path: string, callback: (data: any) => void) => {
    //console.log(`Subscribing to document: ${path}`)
    const docRef = doc(db, path)
    
    const unsubscribe = onSnapshot(docRef, (snapshot: DocumentSnapshot) => {
      const data = snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null
      //console.log(`Received data for document ${path}:`, data)
      callback(data)
    }, (error) => {
      console.error(`Error subscribing to document ${path}:`, error)
    })

    onUnmounted(() => {
      //console.log(`Unsubscribing from document: ${path}`)
      unsubscribe()
    })

    return unsubscribe
  }

  return {
    subscribeToCollection,
    subscribeToDocument
  }
}