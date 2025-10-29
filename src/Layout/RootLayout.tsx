import { Outlet } from "react-router-dom";
import { Header } from "../Components/Header.tsx";
import { socket } from "../Socket.ts";
import { useEffect, useContext } from "react";
import { UserContext } from "../Context/UserContext.tsx";
import { toast, ToastContainer } from "react-toastify";

export const RootLayout: React.FC = () => {
    const { user } = useContext(UserContext) || {};

    useEffect(() => {
        if (!user) return;

        socket.on("connect", () => {
            console.log("Connected to server with ID:", socket.id);
            socket.emit('join_room', { room: user.user_id })
        });

        socket.on('new_friend_request', (data) => {
            const toastId = toast.info(
                <div>
                    <div>Nueva solicitud de amistad</div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                        <button
                            style={{border: 'none', borderRadius: '8px'}}
                            onClick={() => {
                                socket.emit('accept_friend_request', { from: data?.from || data?.senderId || data?.user_id });
                                toast.dismiss(toastId);
                            }}
                        >
                            Aceptar
                        </button>
                        <button
                            style={{border: 'none', borderRadius: '8px'}}
                            onClick={() => {
                                socket.emit('decline_friend_request', { from: data?.from || data?.senderId || data?.user_id });
                                toast.dismiss(toastId);
                            }}
                        >
                            Rechazar
                        </button>
                    </div>
                </div>,
                { autoClose: false, closeOnClick: false }
            );
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from server");
        });
        socket.connect();

        return () => {
            socket.off("connect");
            socket.off("disconnect");

            socket.disconnect();
        };
    }, []);


    return (
        <>
            <ToastContainer />
            <div className="root-layout">
                <Header />
                <main>
                    <Outlet />
                </main>
            </div>
        </>
    );
}