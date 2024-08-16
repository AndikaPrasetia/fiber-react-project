//  komponen Stack dan Container dari Chakra UI
import {  Stack, Container } from '@chakra-ui/react'

//  komponen Navbar dari file Navbar.tsx
import Navbar from './components/Navbar' 

//  komponen TodoForm dari file TodoForm.tsx
import TodoForm from './components/TodoForm' 

//  komponen TodoList dari file TodoList.tsx
import TodoList from './components/TodoList' 

// Mendefinisikan konstanta BASE_URL dengan nilai URL server
export const BASE_URL = "http://localhost:8080" 
// Mendefinisikan fungsi komponen App
function App() { 
  return (
    // {/* Menggunakan komponen Stack dengan tinggi 100vh */}
    <Stack h="100vh">
    {/* Menampilkan komponen Navbar */}
     <Navbar />
    {/* Menggunakan komponen Container untuk membungkus TodoForm dan TodoList */}
     <Container>
    {/* Menampilkan komponen TodoForm */}
      <TodoForm />
    {/* Menampilkan komponen TodoList */}
      <TodoList />
     </Container>
    </Stack>
  )
}

export default App // Mengekspor komponen App sebagai default export
