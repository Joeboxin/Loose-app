import { storage } from "./Firebase";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";

// Upload a file to Firebase Storage
const uploadFile = async (file, path) => {
  try {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    console.log("File uploaded successfully");
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error.message);
    throw error;
  }
};

// Get the download URL of a file
const getFileURL = async (path) => {
  try {
    const storageRef = ref(storage, path);
    const downloadURL = await getDownloadURL(storageRef);
    console.log("File download URL:", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("Error getting file URL:", error.message);
    throw error;
  }
};

// List all files in a directory
const listFiles = async (path) => {
  try {
    const storageRef = ref(storage, path);
    const fileList = await listAll(storageRef);
    const files = fileList.items.map((item) => item.fullPath);
    console.log("Files in directory:", files);
    return files;
  } catch (error) {
    console.error("Error listing files:", error.message);
    throw error;
  }
};

export { uploadFile, getFileURL, listFiles };