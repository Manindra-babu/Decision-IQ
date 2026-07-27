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
import { db, isMock } from '../firebase';

const ROADMAPS_COLLECTION = 'roadmaps';
const CHAT_COLLECTION = 'chat_history';

// Helper functions for LocalStorage mockup
function getLocalStorageItem(key, defaultVal) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultVal;
}

function setLocalStorageItem(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

/**
 * Save a generated roadmap to Firestore
 */
export async function saveRoadmapToFirestore(userId, roadmapData) {
  if (isMock) {
    const localRoadmaps = getLocalStorageItem('decisionIq_roadmaps', []);
    const newDoc = {
      id: 'local-roadmap-' + Math.random().toString(36).substr(2, 9),
      userId,
      ...roadmapData,
      status: 'active',
      createdAt: { seconds: Math.floor(Date.now() / 1000) },
      updatedAt: { seconds: Math.floor(Date.now() / 1000) }
    };
    localRoadmaps.push(newDoc);
    setLocalStorageItem('decisionIq_roadmaps', localRoadmaps);
    return newDoc.id;
  }

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
  if (isMock) {
    const localRoadmaps = getLocalStorageItem('decisionIq_roadmaps', []);
    return localRoadmaps.filter(r => r.userId === userId);
  }

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
  if (isMock) {
    const localRoadmaps = getLocalStorageItem('decisionIq_roadmaps', []);
    const index = localRoadmaps.findIndex(r => r.id === roadmapId);
    if (index !== -1) {
      localRoadmaps[index].nodes = nodes;
      localRoadmaps[index].updatedAt = { seconds: Math.floor(Date.now() / 1000) };
      setLocalStorageItem('decisionIq_roadmaps', localRoadmaps);
    }
    return;
  }

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
  if (isMock) {
    const localRoadmaps = getLocalStorageItem('decisionIq_roadmaps', []);
    const filtered = localRoadmaps.filter(r => r.id !== roadmapId);
    setLocalStorageItem('decisionIq_roadmaps', filtered);
    return;
  }

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
  if (isMock) {
    const localChat = getLocalStorageItem('decisionIq_chat', []);
    localChat.push({
      userId,
      ...message,
      timestamp: { seconds: Math.floor(Date.now() / 1000) }
    });
    setLocalStorageItem('decisionIq_chat', localChat);
    return;
  }

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
  if (isMock) {
    const localChat = getLocalStorageItem('decisionIq_chat', []);
    return localChat
      .filter(c => c.userId === userId)
      .sort((a, b) => a.timestamp?.seconds - b.timestamp?.seconds);
  }

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
