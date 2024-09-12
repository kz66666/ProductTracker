import React from "react"
import { useState, useEffect, useRef} from 'react';
import { Box, Typography, Button, TextField } from "@mui/material";
import NavBar from "./components/NavBar";
import { query, collection, getDocs, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import ProductCard from "./components/ProductCard";
import { firestore } from '@/firebase';
import { useFav } from "@/context/FavoriteContext";
import SelectFilter from "./components/SelectFilter";

export default function Dashboard() {
  const [inputLink, setInputLink] = useState("")

  const [itemCount, setItemCount] = useState(0)

  const {inventory, setInventory, filterInventory, filterItemCount, setFilterItemCount} = useFav()

  const [productList, setProductList] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('http://127.0.0.1:5000/api/scrape', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: inputLink })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Scraping started:', data);
    } catch (error) {
        console.error('Error starting scraping:', error);
    }
  };

  const scrollLeft = () => {
    if (filterInventory.length !== 0 && filterItemCount > 0){
      setFilterItemCount(filterItemCount - 4)
    }
    else if (itemCount > 0) {
      setItemCount(itemCount - 4)
    }
  }

  const scrollRight = () => {
    if (filterInventory.length !== 0 && filterItemCount < filterInventory.length - 4){
      setFilterItemCount(filterItemCount + 4)
    }
    else if (itemCount < inventory.length - 4)
      setItemCount(itemCount + 4)
  }

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'amazonIpadCollection'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      const data = doc.data()
      inventoryList.push(data)
    })
    setInventory(inventoryList)
  }

  const updateDisplay = () => {
    if (filterInventory.length !== 0) {
      const newProductList = []
      for (let i = filterItemCount; i < filterItemCount + 4 && i < filterInventory.length; i++) {
        const product = filterInventory[i]
        newProductList.push(product)
      }
      setProductList(newProductList)
    }
    else {
      const newProductList = []
      for (let i = itemCount; i < itemCount + 4 && i < inventory.length; i++) {
        const product = inventory[i]
        newProductList.push(product)
      }
      setProductList(newProductList)
    }
  }

  useEffect(() => {
    updateInventory()
  }, []);

  useEffect(() => {
    updateDisplay()
  }, [inventory, itemCount, filterItemCount, filterInventory])

  return (
    <>
      <NavBar></NavBar>
      <Box sx={{ margin: '25px' }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            id="outlined-basic"
            variant="outlined"
            label="Enter product URL"
            value={inputLink}
            onChange={(e) => setInputLink(e.target.value)} // Capture user input
          />
          <Button type="submit" variant="contained" color="primary">
            Start Scraping
          </Button>
        </form>
      </Box>
      <Box sx={{ margin: '25px'}}>
        <SelectFilter></SelectFilter>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          overflowX: 'auto',
          padding: 2,
          gap: 2,
          width: '100vw'
        }}
      >
        {productList.map((product) => {
          return (
            <ProductCard
              id={product.id}
              title={product.title}
              rating={product.rating}
              reviewers={product.reviewers}
              price={product.price}
              link={product.link}
              image={product.image}
              isFavored={product.isFavored}
            />
          );
        })}
      </Box>
      <Box display={'flex'} flexDirection={'row'} justifyContent={'center'}>
        <Button onClick = {() => scrollLeft()}>Left</Button>
        <Button onClick = {() => scrollRight()}>Next</Button>
      </Box>
    </>
  )
}
