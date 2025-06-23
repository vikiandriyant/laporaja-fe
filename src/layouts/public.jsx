import Header from "../shared/header";
import Footer from "../shared/footer";
import { Outlet } from "react-router";

export default function PublicLayout() {
    return (
        <>
        <Header/>
        <main style={{ marginTop: '80px' }}>
            <Outlet/>
        </main>
        <Footer/>
        </>
    )
}