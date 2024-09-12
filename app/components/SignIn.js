import { useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Alert } from '@mui/material';

export default function SignIn() {
  // A state to keep track of the user's email
  const [email, setEmail] = useState('')
  // A state to keep track of the user's password
  const [password, setPassword] = useState('')

  // A state to keep track whether there is a sign in process to disable the use of button 
  const [loading, setLoading] = useState(false)
  
  // A state to store the error messages that may occur when the user fails to log in
  const [error, setError] = useState('')

  // Get the login function from the AuthContext
  const { login } = useAuth()

  // useNavigate hook to redirect to different routes
  const navigate = useNavigate()

  // Function to handle the login or sign-in process
  async function handleSignIn(e) {
    // Prevent the default action 
    e.preventDefault()
    
    try {
      // Clear any previous error message
      setError('')
      // Currently trying to login, so set the loading state to true
      setLoading(true)
      // Attempt to login
      await login(email, password)
      // If successful login, nagivate to the dashboard page
      navigate("/")
    }
    catch {
      // Set error message
      setError('Failed to login')
    }
    // Login process is finished regardless of whether it failed or succeeded, so set loading state to false
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
          <Typography variant='h4'>Sign In</Typography>
          <Divider />

          {error && <Alert severity="error">{error}</Alert>}

          <Box display={'flex'} flexDirection={'column'}>
            <Typography>Email</Typography>
          
            <TextField 
              id="outlined-basic" 
              variant="outlined"
              fullwidth
              onChange={(e) => setEmail(e.target.value)}
            />
          </Box>

          <Box display={'flex'} flexDirection={'column'}>
            <Typography>Password</Typography>

            <TextField 
              id="outlined-basic" 
              variant="outlined" 
              type = "password"
              fullwidth
              onChange={(e) => setPassword(e.target.value)}
            />
          </Box>

          <Button 
            disabled = {loading}
            variant='contained'
            onClick = {handleSignIn}
          >Sign In</Button>  

          <Divider />
          
          <Box display="flex" flexDirection="column" gap={0.5}>
            <Link 
              variant='body2'
              href = "./SignUp.js"
              to = "/signup"
            >
              Create an account?
            </Link>

            <Link variant='body2'>
              Forgot Password?
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
