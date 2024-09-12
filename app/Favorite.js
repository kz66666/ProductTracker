import React, { useState, useEffect } from "react";
import ProductCard from "./components/ProductCard";
import { Box, Button } from "@mui/material";
import { useFav } from "@/context/FavoriteContext";
import NavBar from "./components/NavBar";
import SelectFilter from "./components/SelectFilter";

export default function Favorite() {
  const { favInventory, filterFavInventory, filterFavItemCount, setFilterFavItemCount } = useFav()
  const [productList, setProductList] = useState([])
  const [itemCount, setItemCount] = useState(0)

  const scrollLeft = () => {
    if (filterFavInventory.length  !== 0 && filterFavItemCount > 0) {
      setFilterFavItemCount(filterFavItemCount - 4)
    }
    else if (itemCount > 0) {
      setItemCount(itemCount - 4)
    }
  }

  const scrollRight = () => {
    if (filterFavInventory.length !== 0 && filterFavItemCount < filterFavInventory.length - 4) {
      setFilterFavItemCount(filterFavItemCount + 4)
    }
    else if (itemCount < favInventory.length - 4)
      setItemCount(itemCount + 4)
  }

  const updateDisplay = () => {
    if (filterFavInventory.length !== 0) {
      const newProductList = []
      for (let i = filterFavItemCount; i < filterFavItemCount + 4 && i < filterFavInventory.length; i++) {
        const product = filterFavInventory[i]
        newProductList.push(product)
      }
      setProductList(newProductList)
    }
    else {
      const newProductList = []
      for (let i = itemCount; i < itemCount + 4 && i < favInventory.length; i++) {
        const product = favInventory[i]
        newProductList.push(product)
      }
      setProductList(newProductList)
    }
  }

  useEffect(() => {
    updateDisplay()
  }, [favInventory, itemCount, filterFavItemCount, filterFavInventory])

  return (
    <>
      <NavBar></NavBar>
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
  );  
}