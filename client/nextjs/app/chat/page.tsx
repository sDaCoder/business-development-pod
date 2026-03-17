import ChatPage from '@/components/ChatPage'
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Metadata } from 'next'
import { ThemeToggle } from '@/components/theme-toggle'

const page = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-w-0 flex flex-col h-screen overflow-hidden">
        <div className="absolute top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        <div className="absolute top-4 left-4 z-10">
            <SidebarTrigger className="rounded-full" size={'icon-lg'} variant={'outline'} />
        </div>
        <div className="flex-1 overflow-hidden min-w-0 w-full relative">
            <ChatPage />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default page


export const metadata: Metadata = {
  title: "CurioGenius AI | Chat",
  description: "CurioGenius AI is a platform for creating and sharing AI-generated software applications, without any need of coding skills.",
  icons: {
    icon: "/logo.png",
  },
};