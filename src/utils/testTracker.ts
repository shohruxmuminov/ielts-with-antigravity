import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';

export interface TestResult {
  userId: string;
  testId: string;
  testType: 'mock' | 'reading' | 'listening' | 'writing';
  title: string;
  score: number | string;
  band: number | string;
  details?: any;
  completedAt: Date;
}

export const saveTestResult = async (result: Omit<TestResult, 'completedAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'test_results'), {
      ...result,
      completedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving test result:', error);
    throw error;
  }
};

export const getUserCompletions = async (userId: string, testType?: string) => {
  try {
    let q = query(collection(db, 'test_results'), where('userId', '==', userId));
    if (testType) {
      q = query(q, where('testType', '==', testType));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as TestResult);
  } catch (error) {
    console.error('Error fetching user completions:', error);
    return [];
  }
};
