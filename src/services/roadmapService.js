// src/services/roadmapService.js
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc, 
  doc, 
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

const ROADMAPS_COLLECTION = 'roadmaps';
const CHAT_COLLECTION = 'chat_history';

/**
 * Save a generated roadmap to Firestore
 */
export async function saveRoadmapToFirestore(userId, roadmapData) {
  try {
    const docRef = await addDoc(collection(db, ROADMAPS_COLLECTION), {
      userId,
      ...roadmapData,
      status: 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving roadmap:", error);
    throw error;
  }
}

/**
 * Fetch all saved roadmaps for a user
 */
export async function getUserRoadmaps(userId) {
  try {
    const q = query(collection(db, ROADMAPS_COLLECTION), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching roadmaps:", error);
    throw error;
  }
}

/**
 * Update roadmap node status (e.g., mark as completed)
 */
export async function updateRoadmapProgress(roadmapId, nodes) {
  try {
    const roadmapRef = doc(db, ROADMAPS_COLLECTION, roadmapId);
    await updateDoc(roadmapRef, {
      nodes,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating roadmap progress:", error);
    throw error;
  }
}

/**
 * Delete a roadmap
 */
export async function deleteRoadmap(roadmapId) {
  try {
    await deleteDoc(doc(db, ROADMAPS_COLLECTION, roadmapId));
  } catch (error) {
    console.error("Error deleting roadmap:", error);
    throw error;
  }
}

/**
 * Save chat message to Firestore
 */
export async function saveChatMessage(userId, message) {
  try {
    await addDoc(collection(db, CHAT_COLLECTION), {
      userId,
      ...message,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("Error saving chat message:", error);
    throw error;
  }
}

/**
 * Load chat history for a user
 */
export async function getChatHistory(userId) {
  try {
    const q = query(collection(db, CHAT_COLLECTION), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs
      .map(doc => doc.data())
      .sort((a, b) => a.timestamp?.seconds - b.timestamp?.seconds);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    throw error;
  }
}
