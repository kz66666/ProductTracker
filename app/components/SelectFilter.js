import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useFav } from '@/context/FavoriteContext';

export default function SelectFilter() {
  const [sort, setSort] = React.useState('');
  const {inventory, filterInventory, favInventory, filterFavInventory, setInventory, setFilterInventory, setFavInventory, setFilterFavInventory} = useFav()

  const handleSortComparator = (a, b, key, order) => {
    if (order === "ascending") {
      return parseInt(a[key]) - parseInt(b[key]);
    }
    else {
      return parseInt(b[key]) - parseInt(a[key]);
    }
  }

  const handleChange = (e) => {
    const selectedSort = e.target.value;
    setSort(selectedSort);
  
    if (selectedSort === "Price: Low to High") {
      const sortedInventory = [...inventory].sort((a, b) => handleSortComparator(a, b, 'price', 'ascending'));
      const sortedFilterInventory = [...filterInventory].sort((a, b) => handleSortComparator(a, b, 'price', 'ascending'));
      const sortedFavInventory = [...favInventory].sort((a, b) => handleSortComparator(a, b, 'price', 'ascending'));
      const sortedFilterFavInventory = [...filterFavInventory].sort((a, b) => handleSortComparator(a, b, 'price', 'ascending'));

      setInventory(sortedInventory);
      setFilterInventory(sortedFilterInventory);
      setFavInventory(sortedFavInventory);
      setFilterFavInventory(sortedFilterFavInventory);
    }
    else if (selectedSort === "Price: High to Low") {
      const sortedInventory = [...inventory].sort((a, b) => handleSortComparator(a, b, 'price', 'descending'));
      const sortedFilterInventory = [...filterInventory].sort((a, b) => handleSortComparator(a, b, 'price', 'descending'));
      const sortedFavInventory = [...favInventory].sort((a, b) => handleSortComparator(a, b, 'price', 'descending'));
      const sortedFilterFavInventory = [...filterFavInventory].sort((a, b) => handleSortComparator(a, b, 'price', 'descending'));

      setInventory(sortedInventory);
      setFilterInventory(sortedFilterInventory);
      setFavInventory(sortedFavInventory);
      setFilterFavInventory(sortedFilterFavInventory);
    }
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Filter</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={sort}
          label="Filter"
          onChange={handleChange}
        >
          <MenuItem value="Price: Low to High">Price: Low to High</MenuItem>
          <MenuItem value="Price: High to Low">Price: High to Low</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}