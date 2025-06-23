import { Outlet } from "react-router";
import Sidebar from "../shared/sidebar";

export default function AdminLayout() {
    return (
        <>
        <Sidebar/>
        <Outlet/>
        </>
    )
}