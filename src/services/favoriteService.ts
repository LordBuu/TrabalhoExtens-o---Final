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
import { FavoriteItem } from "../types";

const FAVORITES_COLLECTION = "favorites";

export async function addFavorite(
  userId: string,
  itemType: 'article' | 'strategy' | 'answer',
  itemId: string,
  title: string,
  snippet: string,
  category?: string
): Promise<FavoriteItem> {
  const id = `fav-${userId.substring(0, 5)}-${itemId}`;
  const fav: FavoriteItem = {
    id,
    userId,
    itemType,
    itemId,
    title,
    snippet,
    category: category || "Geral",
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, FAVORITES_COLLECTION, id), fav);
    return fav;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${FAVORITES_COLLECTION}/${id}`);
  }
}

export async function fetchUserFavorites(userId: string): Promise<FavoriteItem[]> {
  try {
    const q = query(
      collection(db, FAVORITES_COLLECTION),
      where("userId", "==", userId)
    );
    const snapshot = await getDocs(q);
    const favorites: FavoriteItem[] = [];

    snapshot.forEach((d) => {
      favorites.push({ id: d.id, ...d.data() } as FavoriteItem);
    });

    return favorites.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, FAVORITES_COLLECTION);
  }
}

export async function removeFavorite(favoriteId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, FAVORITES_COLLECTION, favoriteId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${FAVORITES_COLLECTION}/${favoriteId}`);
  }
}

export async function removeFavoriteByItemId(userId: string, itemId: string): Promise<void> {
  const id = `fav-${userId.substring(0, 5)}-${itemId}`;
  try {
    await deleteDoc(doc(db, FAVORITES_COLLECTION, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${FAVORITES_COLLECTION}/${id}`);
  }
}
