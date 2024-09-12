import React, { useState } from "react";
import { Box, Typography, TextField } from "@mui/material";

export default function SearchBar({ onSearch }) {
  const [input, setInput] = useState("")

  const handleChange = (value) => {
    onSearch(value)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleChange(input)
    }
  }

  return (
    <Box sx={{ flexGrow: 2 }} display = "flex" flexDirection={'row'} alignItems={'center'}>
      <Typography sx={{ marginRight: '10px'}}>
        Search
      </Typography>
      <TextField
        fullWidth
        id="outlined-basic" 
        variant="outlined"
        border = "none"
        sx= {{input: {color: 'black', backgroundColor: 'white'}}}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
      ></TextField>
    </Box>
  )
}