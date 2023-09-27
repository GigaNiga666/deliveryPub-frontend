import {QueryClient, QueryClientProvider} from "react-query";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {App} from "./Pages/App/App";
import {Product} from "./Pages/Product/Product";
import {Cart} from "./Pages/Cart/Cart";
import {Delivery} from "./Pages/Delivery/Delivery";
import {Admin} from "./Pages/Admin/Admin";

const queryClient = new QueryClient()

const Wrapper = ({}) => {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route element={<App/>} path='/'/>
                    <Route element={<Product/>} path='/:id'/>
                    <Route element={<Cart/>} path='/cart'/>
                    <Route element={<Delivery/>} path='/form'/>
                    <Route element={<Admin/>} path='/admin'/>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
};

export {Wrapper};