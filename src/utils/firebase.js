import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, getDocs, deleteDoc, query, orderBy, updateDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyB7gciuGLI2d_z-IC_p-DGHNC0Cq6FzKhE",
  authDomain: "ats-resume-maker-33665.firebaseapp.com",
  projectId: "ats-resume-maker-33665",
  storageBucket: "ats-resume-maker-33665.firebasestorage.app",
  messagingSenderId: "261974508078",
  appId: "1:261974508078:web:3c6e4904d5a93b2792d5bf"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider)
export const logOut = () => signOut(auth)

export async function saveResume(userId, data) {
  const ref = doc(collection(db, 'users', userId, 'resumes'))
  await setDoc(ref, { ...data, updatedAt: new Date().toISOString() })
  return ref.id
}

export async function updateResume(userId, resumeId, data) {
  await updateDoc(doc(db, 'users', userId, 'resumes', resumeId), { ...data, updatedAt: new Date().toISOString() })
}

export async function getUserResumes(userId) {
  const q = query(collection(db, 'users', userId, 'resumes'), orderBy('updatedAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function deleteResume(userId, resumeId) {
  await deleteDoc(doc(db, 'users', userId, 'resumes', resumeId))
}
