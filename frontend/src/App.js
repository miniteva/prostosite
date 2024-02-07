import {Routes, Route} from 'react-router-dom';
import Container from "@mui/material/Container";
import {useDispatch, useSelector} from "react-redux";


import {Header} from "./components";
import {Home, FullMenu, Registration, AddDish, AddMenu, Login, FullDish} from "./pages";
import React from 'react';
import {logout, selectIsAuth} from "./redux/slices/auth";
import {fetchAuthMe} from "./redux/slices/auth";


function App() {
    const dispatch = useDispatch();
    const isAuth = useSelector(selectIsAuth);

    React.useEffect(() => {
        dispatch(fetchAuthMe())
    }, [])
    return (
        <>
            <Header/>
            <Container maxWidth="lg" >
                <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route path="/menu/:id" element={<FullMenu/>}/>
                    <Route path="/menu/:id/edit" element={<AddMenu/>}/>
                    <Route path="/dish/:id" element={<FullDish/>}/>
                    <Route path="/dish/:id/edit" element={<AddDish/>}/>
                    <Route path="/add-dish" element={<AddDish/>}/>
                    <Route path="/add-menu" element={<AddMenu/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Registration/>}/>

                    {/*<FullPost />*/}
                    {/*<AddMenu />*/}
                    {/*<Login />*/}
                    {/*<Registration />*/}
                </Routes>

            </Container>
        </>
    );
}

export default App;
