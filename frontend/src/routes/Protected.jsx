import {Outlet, useNavigate} from "react-router-dom"
import {useAuth} from "../store/authProvider.jsx";
import {useEffect, useState} from "react";
import Overlay from "../components/modal-popup/overlay/Overlay.jsx";

const ProtectedRoute = () => {
    const {tokenVerified, token, setTokenVerified,} = useAuth();
    const [waitingForVerification, setWaitingForVerification] = useState(false);
    const navigate = useNavigate();

    // useEffect(() => {
    //     if (!tokenVerified && token) {
    //         setWaitingForVerification(false)
    //         setTokenVerified(true);
    //     } else {
    //         navigate("login/")
    //     }
    // }, [token])

    if (waitingForVerification) {
        return (
            <Overlay>

            </Overlay>
        )
    } else return <Outlet/>
}

export default ProtectedRoute
