import React, { useState, useContext, useEffect } from "react";
import { collection, doc, getDoc, setDoc, deleteDoc, getDocs, query } from 'firebase/firestore';
import { firestore } from '@/firebase';

const FavoriteContext = React.createContext();

const useFav = () => {
  return useContext(FavoriteContext);
};

export function FavoriteProvider({ children }) {
  const [favInventory, setFavInventory] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [filterInventory, setFilterInventory] = useState([]);
  const [filterFavInventory, setFilterFavInventory] = useState([]);
  const [filterItemCount, setFilterItemCount] = useState(0)
  const [filterFavItemCount, setFilterFavItemCount] = useState(0)

  useEffect(() => {
    const fetchFavInventory = async () => {
      const q = query(collection(firestore, "favoredProductsCollection"));
      const querySnapshot = await getDocs(q);
      const favInventoryList = querySnapshot.docs.map(doc => doc.data());
      setFavInventory(favInventoryList);
    };

    fetchFavInventory();
  }, []);

  async function handleFavoriteToggle(id) {
    const docRef = doc(collection(firestore, "amazonCollection"), id)
    const docSnap = await getDoc(docRef)
    const docData = docSnap.data()
    const updatedFavored = !docData.isFavored
    setDoc(docRef, { isFavored: updatedFavored}, { merge: true })

    if (updatedFavored) {
      const favoredDocRef = doc(collection(firestore, 'favoredProductsCollection'), id)
      const newDocSnap = await getDoc(docRef)
      const newDocData = newDocSnap.data()
      await setDoc(favoredDocRef, newDocData)
      setFavInventory(prevFavInventory => [...prevFavInventory, newDocData])
    }
    else {
      await deleteDoc(doc(collection(firestore, "favoredProductsCollection"), id))
      const q = query(collection(firestore, "favoredProductsCollection"))
      const querySnapshot = await getDocs(q);
      const newFavoriteList = []
      querySnapshot.forEach((doc) => {
        newFavoriteList.push(doc.data())
      })
      setFavInventory(newFavoriteList)
    }

    setInventory(inventory => 
      inventory.map(product => 
        product.id === id ? { ...product, isFavored: updatedFavored } : product
      )
    );
  }
  
  const values = {
    handleFavoriteToggle,
    inventory,
    setInventory,
    favInventory,
    setFavInventory,
    filterInventory, 
    setFilterInventory,
    filterFavInventory, 
    setFilterFavInventory,
    filterItemCount,
    setFilterItemCount,
    filterFavItemCount, 
    setFilterFavItemCount
  };

  return (
    <FavoriteContext.Provider value={values}>
      {children}
    </FavoriteContext.Provider>
  );
}

export { useFav };

