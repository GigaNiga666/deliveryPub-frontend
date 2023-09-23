import {QueryClient, QueryClientProvider} from "react-query";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {App} from "./Pages/App/App";
import {Product} from "./Pages/Product/Product";
import {Cart} from "./Pages/Cart/Cart";
import {Delivery} from "./Pages/Delivery/Delivery";

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
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
};

export {Wrapper};