import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchBar from './SearchBar';
import { useFav } from '@/context/FavoriteContext';

export default function NavBar() {
  // A state variable used to keep track of any error messages
  const [error, setError] = useState('')

  // A state variable to keep track of whether the user is currently being redirected
  const [loading, setLoading] = useState(false)

  const { inventory, setFilterInventory, favInventory, setFilterFavInventory } = useFav()

  // Get the signout function from AuthContext
  const { signout } = useAuth()
  // useNavigate to redirect the user to a different route
  const navigate = useNavigate()

  const location = useLocation()
   
  // Function used to handle sign out
  const handleSignOut = async (e) => {  
    try {
      // Clear any error message if there was any
      setError('')
      // Set loading state to true to indicate that the logout process is happening
      setLoading(true)
      // Call signout process
      await signout()
      // Redirect to the login page if the signout process was a success
      navigate("/login")
    }
    catch {
      // Set error message 
      setError("Failed to sign out")
    }
    // The signout process is over, so set loading to false regardless if the process succeeded or not
    setLoading(false)
  }

  const handleNavigation = async (e) => {
    try {
      setError('')
      setLoading(true)
      if (location.pathname === "/") {
        navigate("/favorite")
      }
      else {
        navigate("/")
      }
    }
    catch {
      setError("Failed")
    }
    setLoading(false)
  }

  const buttonName = location.pathname === "/" ? "Favorite" : "Dashboard"

  const handleSearch = (query) => {
    if (query === '') {
      setFilterInventory([])
      setFilterFavInventory([])
      return;
    }

    const lowercasedQuery = query.toLowerCase()

    if (location.pathname === "/") {
      const result = inventory.filter(item => 
        item.title && item.title.toLowerCase().includes(lowercasedQuery)
      )
      setFilterInventory(result)
    }
    else if (location.pathname === "/favorite") {
      const result = favInventory.filter(item => 
        item.title && item.title.toLowerCase().includes(lowercasedQuery)
      ) 
      setFilterFavInventory(result)
    }
  }

  return (
    <Box>
      <AppBar position='static'>
        <Toolbar>
          <Box sx={{ marginRight: '50px' }}>
            <Typography>
              Product Tracker
            </Typography>
          </Box>

          <SearchBar onSearch={handleSearch}></SearchBar>

          <Box sx={{ flexGrow: 0 }} marginLeft={'20px'}>
            <Button color = "inherit" onClick={handleSignOut} disabled={loading}>Sign Out</Button>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Button color = "inherit" onClick={handleNavigation} disabled={loading}>{buttonName}</Button>
          </Box>
        </Toolbar>
      </AppBar>  
    </Box>
  )
}