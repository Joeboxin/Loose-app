import { doc, setDoc, getDoc, getDocs, collection, query, where } from "firebase/firestore";
import { database } from "./Firebase";

// Add or update a document in a collection
const addDocument = async (collectionName, documentId, data) => {
  try {
    await setDoc(doc(database, collectionName, documentId), data);
    console.log("Document added/updated successfully");
  } catch (error) {
    console.error("Error adding/updating document:", error.message);
    throw error;
  }
};

// Get a document by ID
const getDocument = async (collectionName, documentId) => {
  try {
    const documentSnapshot = await getDoc(doc(database, collectionName, documentId));
    if (documentSnapshot.exists()) {
      console.log("Document data:", documentSnapshot.data());
      return documentSnapshot.data();
    } else {
      console.log("Document not found");
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error.message);
    throw error;
  }
};

// Query documents in a collection
const queryDocuments = async (collectionName, field, operator, value) => {
  try {
    const q = query(collection(database, collectionName), where(field, operator, value));
    const querySnapshot = await getDocs(q);
    const results = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });
    console.log("Query results:", results);
    return results;
  } catch (error) {
    console.error("Error querying documents:", error.message);
    throw error;
  }
};
export { addDocument, getDocument, queryDocuments };