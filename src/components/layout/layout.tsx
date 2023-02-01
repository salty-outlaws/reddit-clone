import React from 'react';
import Navbar from '../Navbar/Navbar';


type layoutProps = {
    children: React.ReactNode
};

const layout:React.FC<layoutProps> = ({ children }) => {
    
    return (
    <>
    <Navbar/>
    <main>{children}</main>
    </>
    )
}
export default layout;