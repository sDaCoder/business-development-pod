import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarSeparator,
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { ChatCircle, Gear, User } from "@phosphor-icons/react/dist/ssr"
import { CurioGeniusLogo } from "@/components/logo"

// Dummy data for chats and settings
const items = [
	{
		title: "New Chat",
		url: "#",
		icon: ChatCircle,
	},
	{
		title: "Profile",
		url: "#",
		icon: User,
	},
	{
		title: "Settings",
		url: "#",
		icon: Gear,
	},
]

export function AppSidebar() {
	return (
		<Sidebar>
			<SidebarHeader className="p-4 flex flex-row items-center gap-3">
				<div className="size-8 flex items-center justify-center shrink-0">
					<CurioGeniusLogo className="size-8 text-primary" />
				</div>
				<span className="font-semibold text-lg tracking-tight truncate">CurioGenius</span>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton render={<a href={item.url} />}>
										<item.icon />
										<span>{item.title}</span>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarSeparator />

				<SidebarGroup>
					<SidebarGroupLabel className="text-xs font-semibold text-foreground/70">Mistral API</SidebarGroupLabel>
					<SidebarGroupContent className="px-2 pb-2">
						<div className="flex flex-col gap-1.5 p-2 rounded-md bg-accent/20 border border-border/40">
							<Input 
								id="mistral-api-key" 
								type="password" 
								placeholder="Mistral API Key" 
								className="h-7 text-xs bg-background border-none shadow-none focus-visible:ring-1 focus-visible:ring-primary/20 placeholder:text-muted-foreground/50"
							/>
						</div>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarSeparator />

				<SidebarGroup>
					<SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{/* Place holder for chats */}
							<SidebarMenuItem>
								<SidebarMenuButton render={<a href="#" />}>
									<ChatCircle />
									<span>Chat - Marketing plan</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton render={<a href="#" />}>
									<ChatCircle />
									<span>Chat - App Ideas</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	)
}
