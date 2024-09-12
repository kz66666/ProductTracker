import { useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function SignUp() {
  // State variables used to store and keep track of the user's email, password, and password for confirmation
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // A state used to store the error messages when the user fails to signup
  const [error, setError] = useState("")
  // A state used to determine whether the signup process is still ongoing
  const [loading, setLoading] = useState(false)

  // Get the signup function from AuthContext
  const { signup } = useAuth()

  // useNavigate hook to redirect to different routes
  const navigate = useNavigate();

  // A function used to handle the sign up process
  async function handleSignUp(e) {
    // Prevent default action
    e.preventDefault()

    // Check if the password the user typed is the same as the second password the user typed for confirmation
    if (confirmPassword !== registerPassword) {
      // Set error message
      setError("Passwords do not match")
    }

    try {
      // Clear any previous error message if there was any
      setError("")
      // Set loading state to true to indicate that the signup process is currently active so disable button usage
      setLoading(true)
      // Register a new account
      await signup(registerEmail, registerPassword)
      // Redirect to the dashboard page after successful signup
      navigate("/")
    }
    catch {
      // Set error message
      setError("Failed to create an account")
    }
    // Set the loading state to false because the sign up process is over regardless of whether the sign up was a success or not
    setLoading(false)
  }

  return (
    <Box
      width = "100vw"
      height = "100vh"
      display = {'flex'}
      flexDirection={'column'}
      alignItems = {'center'}
      justifyContent= {'center'}
    >
      <Box 
        border = "1px solid #ccc" 
        borderRadius={'10px'}
        padding={'20px'}
        boxShadow={'2px 2px 5px rgba(0, 0, 0, 0.3)'}
      >
        <Box display={'flex'} flexDirection={'column'} gap={2} sx={{ width: '300px' }}>
          <Typography variant='h4'>Sign Up</Typography>
          <Divider />

          {error && <Alert severity="error">{error}</Alert>}

          <Box display={'flex'} flexDirection={'column'}>
            <Typography>Email</Typography>
          
            <TextField 
              id="outlined-basic" 
              variant="outlined"
              fullwidth
              onChange={(e) => {setRegisterEmail(e.target.value)}}
            />
          </Box>

          <Box display={'flex'} flexDirection={'column'}>
            <Typography>Password</Typography>

            <TextField 
              id="outlined-basic" 
              variant="outlined" 
              type = "password"
              fullwidth
              onChange={(e) => {setRegisterPassword(e.target.value)}}
            />
          </Box>

          <Box display={'flex'} flexDirection={'column'}>
            <Typography>Confirm Password</Typography>

            <TextField 
              id="outlined-basic" 
              variant="outlined" 
              type = "password"
              fullwidth
              onChange={(e) => {setConfirmPassword(e.target.value)}}
            />
          </Box>

          <Button 
            disabled = {loading}
            variant='contained'
            onClick={handleSignUp}
          >Sign Up</Button>  

          <Divider />
          
          <Box display="flex" flexDirection="column" gap={0.5}>
            <Link variant='body2' to = "/login">
              Already have an account?
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
