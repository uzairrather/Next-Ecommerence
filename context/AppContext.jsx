'use client'
import axios from "axios";
import { productsDummyData} from "../assets/assets";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";


export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext)
}

export const AppContextProvider = (props) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY
    const router = useRouter()
    const {user}  =useUser()
    //get intregated with frontend
    const {getToken}= useAuth()
    const [products, setProducts] = useState([])
    const [userData, setUserData] = useState(false)
    const [isSeller, setIsSeller] = useState(false)
    const [cartItems, setCartItems] = useState({})

    const fetchProductData = async () => {

        try {
            const {data} = await axios.get('/api/product/list')

            if(data.success){
                setProducts(data.products)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            
        }
    }

   const fetchUserData = useCallback (async () => {
    try {
        // Early exit if no user or role check
        if (!user) return;

        if (user?.publicMetadata?.role === 'seller') {
            setIsSeller(true);
        }

        const token = await getToken();
        if (!token) {
            toast.error("No authentication token found.");
            return;
        }

        const { data } = await axios.get('/api/user/data', {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (data.success) {
            setUserData(data.user);
            setCartItems(data.user.cartItems || {}); // Fallback to empty object
        } else {
            toast.error(data.message || "Failed to fetch user data.");
        }
    } catch (error) {
        const errMsg = error?.response?.data?.message || error.message || "An error occurred.";
        toast.error(errMsg);
    }
}, [user]); 


    const addToCart = async (itemId) => {

        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] += 1;
        }
        else {
            cartData[itemId] = 1;
        }
        setCartItems(cartData);
        if (user){
            try {
                const token = await getToken()
                await axios.post('/api/cart/update', {cartData}, {headers:{Authorization: `Bearer ${token}`}})
                toast.success('item is added to cart')

            } catch (error) {
                toast.error(error.message)
            }
        }
    }

    const updateCartQuantity = async (itemId, quantity) => {

        let cartData = structuredClone(cartItems);
        if (quantity === 0) {
            delete cartData[itemId];
        } else {
            cartData[itemId] = quantity;
        }
        setCartItems(cartData)
        if (user){
            try {
                const token = await getToken()
                await axios.post('/api/cart/update', {cartData}, {headers:{Authorization: `Bearer ${token}`}})
                toast.success('Cart Updated')

            } catch (error) {
                toast.error(error.message)
            }
        }
    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            if (cartItems[items] > 0) {
                totalCount += cartItems[items];
            }
        }
        return totalCount;
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            if (cartItems[items] > 0) {
                totalAmount += itemInfo.offerPrice * cartItems[items];
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    }

    useEffect(() => {
        fetchProductData()
    }, [])

    useEffect(() => {
        if(user)
        {
            fetchUserData()
        }
    }, [user])

    const value = {
        user,getToken,
        currency, router,
        isSeller, setIsSeller,
        userData, fetchUserData,
        products, fetchProductData,
        cartItems, setCartItems,
        addToCart, updateCartQuantity,
        getCartCount, getCartAmount
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}