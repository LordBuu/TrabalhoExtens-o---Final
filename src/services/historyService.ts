import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  deleteDoc
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../firebase/config";
import { QuestionHistory, PedagogicalAnalysisResult, ScientificSource } from "../types";

const QUESTIONS_COLLECTION = "questions";

export async function saveQuestionToHistory(
  userId: string,
  question: string,
  structuredResult: PedagogicalAnalysisResult,
  sources: ScientificSource[],
  category?: string
): Promise<QuestionHistory> {
  const id = `q-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const simplifiedSources = sources.map((s) => ({
    id: s.id,
    title: s.title,
    authors: s.authors,
    year: s.year,
    evidenceLevel: s.evidenceLevel,
    doi: s.doi,
  }));

  const historyItem: QuestionHistory = {
    id,
    userId,
    question,
    answer: JSON.stringify(structuredResult),
    structuredResult,
    sources: simplifiedSources,
    category: category || "Geral",
    hasSufficientEvidence: structuredResult.hasSufficientEvidence,
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, QUESTIONS_COLLECTION, id), {
      userId: historyItem.userId,
      question: historyItem.question,
      answer: historyItem.answer,
      sources: historyItem.sources,
      category: historyItem.category,
      hasSufficientEvidence: historyItem.hasSufficientEvidence,
      createdAt: historyItem.createdAt,
    });
    return historyItem;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${QUESTIONS_COLLECTION}/${id}`);
  }
}

export async function fetchUserQuestions(userId: string): Promise<QuestionHistory[]> {
  try {
    const q = query(
      collection(db, QUESTIONS_COLLECTION),
      where("userId", "==", userId)
    );
    const snapshot = await getDocs(q);
    const questions: QuestionHistory[] = [];

    snapshot.forEach((d) => {
      const data = d.data();
      let structuredResult: PedagogicalAnalysisResult | undefined;
      try {
        if (data.answer) {
          structuredResult = JSON.parse(data.answer);
        }
      } catch {
        // If plain text
      }

      questions.push({
        id: d.id,
        userId: data.userId,
        question: data.question,
        answer: data.answer,
        structuredResult,
        sources: data.sources || [],
        category: data.category,
        hasSufficientEvidence: data.hasSufficientEvidence,
        createdAt: data.createdAt,
      });
    });

    // Client-side sort descending by createdAt
    return questions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, QUESTIONS_COLLECTION);
  }
}

export async function deleteQuestionHistory(questionId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, QUESTIONS_COLLECTION, questionId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${QUESTIONS_COLLECTION}/${questionId}`);
  }
}
