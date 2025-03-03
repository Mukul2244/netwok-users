import Layout from "@/components/other/Layout"
import { SocketProvider } from '@/context/SocketContext'
import { ChatProvider } from '@/context/ChatContext'

export default function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
            <SocketProvider>
                <ChatProvider>
                    <Layout>
                        {children}
                    </Layout>
                </ChatProvider>
            </SocketProvider>
    )
}