import {
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  query,
  orderBy,
  limit
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../firebase/config";
import { ScientificSource, Strategy } from "../types";
import { INITIAL_SCIENTIFIC_SOURCES, INITIAL_STRATEGIES } from "./scientificData";

const SOURCES_COLLECTION = "scientific_sources";
const STRATEGIES_COLLECTION = "strategies";

// Cache in memory for instant responsiveness
let cachedSources: ScientificSource[] = [];
let cachedStrategies: Strategy[] = [];

export async function fetchScientificSources(): Promise<ScientificSource[]> {
  try {
    const colRef = collection(db, SOURCES_COLLECTION);
    const snapshot = await getDocs(colRef);

    if (snapshot.empty) {
      // If collection is empty, use initial seed and try to sync
      cachedSources = [...INITIAL_SCIENTIFIC_SOURCES];
      return cachedSources;
    }

    const sources: ScientificSource[] = [];
    snapshot.forEach((d) => {
      sources.push({ id: d.id, ...d.data() } as ScientificSource);
    });

    cachedSources = sources;
    return sources;
  } catch (error) {
    console.warn("Falling back to local scientific sources due to Firestore fetch state:", error);
    // Graceful fallback to initial seed if Firestore is not yet populated
    cachedSources = [...INITIAL_SCIENTIFIC_SOURCES];
    return cachedSources;
  }
}

export async function fetchStrategies(): Promise<Strategy[]> {
  try {
    const colRef = collection(db, STRATEGIES_COLLECTION);
    const snapshot = await getDocs(colRef);

    if (snapshot.empty) {
      cachedStrategies = [...INITIAL_STRATEGIES];
      return cachedStrategies;
    }

    const strategies: Strategy[] = [];
    snapshot.forEach((d) => {
      strategies.push({ id: d.id, ...d.data() } as Strategy);
    });

    cachedStrategies = strategies;
    return strategies;
  } catch (error) {
    console.warn("Falling back to local strategies due to Firestore fetch state:", error);
    cachedStrategies = [...INITIAL_STRATEGIES];
    return cachedStrategies;
  }
}

export async function addScientificSource(source: Omit<ScientificSource, "id" | "createdAt">): Promise<ScientificSource> {
  const id = `src-${Date.now()}`;
  const newSource: ScientificSource = {
    ...source,
    id,
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, SOURCES_COLLECTION, id), newSource);
    cachedSources.unshift(newSource);
    return newSource;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${SOURCES_COLLECTION}/${id}`);
  }
}

export async function addStrategy(strategy: Omit<Strategy, "id" | "createdAt">): Promise<Strategy> {
  const id = `strat-${Date.now()}`;
  const newStrategy: Strategy = {
    ...strategy,
    id,
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, STRATEGIES_COLLECTION, id), newStrategy);
    cachedStrategies.unshift(newStrategy);
    return newStrategy;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${STRATEGIES_COLLECTION}/${id}`);
  }
}

export function getCachedSources(): ScientificSource[] {
  return cachedSources.length > 0 ? cachedSources : INITIAL_SCIENTIFIC_SOURCES;
}

export function getCachedStrategies(): Strategy[] {
  return cachedStrategies.length > 0 ? cachedStrategies : INITIAL_STRATEGIES;
}
