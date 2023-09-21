import ReactDOM from 'react-dom/client'
import {App} from './Pages/App/App.tsx'
import './index.css'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {Product} from "./Pages/Product/Product";
import {QueryClient, QueryClientProvider} from "react-query";
import {Cart} from "./Pages/Cart/Cart";

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <Routes>
                <Route element={<App/>} path='/'/>
                <Route element={<Product/>} path='/:id'/>
                <Route element={<Cart/>} path='/cart'/>
            </Routes>
        </BrowserRouter>
    </QueryClientProvider>
)
