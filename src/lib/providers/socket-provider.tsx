"use client"
import { useState, useEffect,useContext,createContext } from 'react';
import {io as ClientIO} from "socket.io-client"

type SocketContextType = {
    socket:any;
    isConnected:boolean;
}

const SocketContext = createContext<SocketContextType>(
    {
        socket:null,
        isConnected:false
    }
)

export const useSocket = ()=>{
    return useContext(SocketContext);
}

export const SocketProvider = ({children}:{children:React.ReactNode})=>{
    const [socket, setsocket ] = useState(null)
    const [isConnected, setIsConnected] = useState(false)

    useEffect(()=>{
        const socketinstance = new (ClientIO as any)(
            process.env.NEXT_PUBLIC_URL!,
            {
                path:'/api/socket/io',
                addTrailingSlash:false
            }
        );

        socketinstance.on('connect',()=>{
            setIsConnected(true)
        })
        socketinstance.on('disconnect',()=>{
            setIsConnected(false)
        })
        setsocket(socketinstance)

        return ()=>{
            socketinstance.disconnect()
        }
    },[])


    return (
        <SocketContext.Provider value={{socket,isConnected}}>
            {children}
        </SocketContext.Provider>
    )
}