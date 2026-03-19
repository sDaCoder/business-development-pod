"use client"
import { Message, MessageContent, MessageResponse } from "./ai-elements/message";
import {
    PromptInput,
    PromptInputBody,
    PromptInputFooter,
    PromptInputSubmit,
    PromptInputTextarea,
    PromptInputTools
} from "./ai-elements/prompt-input";
import {
    ModelSelector,
    ModelSelectorContent,
    ModelSelectorEmpty,
    ModelSelectorGroup,
    ModelSelectorInput,
    ModelSelectorItem,
    ModelSelectorList,
    ModelSelectorLogo,
    ModelSelectorLogoGroup,
    ModelSelectorName,
    ModelSelectorTrigger
} from "./ai-elements/model-selector";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import axios from "axios";
import { Conversation, ConversationContent, ConversationScrollButton } from "./ai-elements/conversation";
import { Shimmer } from "./ai-elements/shimmer";
import { CurioGeniusLogo } from "./logo";
import { Check } from "@phosphor-icons/react";
import { toast } from "sonner";
import ApproveAgent from "./approve-agent";

const models = [
    { id: "devstral-latest", name: "Devstral", provider: "mistral" },
    { id: "devstral-medium-latest", name: "Devstral Medium", provider: "mistral" },
    { id: "mistral-vibe-cli-latest", name: "Mistral Vibe CLI", provider: "mistral" },
    // { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", provider: "google" },
    // { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", provider: "google" },
];

const ChatPage = () => {

    // const { messages, sendMessage } = useChat({
    //     transport: new DefaultChatTransport({
    //         api: "/api/chat"
    //     })
    // });
    const [text, setText] = useState("")
    const [model, setModel] = useState<string>(models[0].id);
    const [prevModel, setPrevModel] = useState<string>(models[0].id)
    const [messages, setMessages] = useState<{ role: "user" | "assistant" | "system", text: string }[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [loadingMessageIndex, setLoadingMessageIndex] = useState(0)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const [bizAgentState, setBizAgentState] = useState<"approve" | "modify" | "">("")

    const selectedModel = models.find(m => m.id === model) || models[0];

    const loadingMessages = [
        "Thinking...",
        "Analyzing the data...",
        "Generating insights...",
        "Retrieving business cases...",
        "Almost there...",
    ]

    const onSubmit = async (e) => {
        if (!text.trim() || isLoading) return;

        try {
            setIsLoading(true)
            const newUserMessage: { role: "user" | "assistant" | "system", text: string } = { role: "user", text }
            const currentMessages = [...messages, newUserMessage]

            // Optimistically add user message
            setMessages(currentMessages)
            setText("")

            console.log("Sending request with prompt:", text)
            const res = await axios.post("http://localhost:8080/start-biz-agent", {
                user_id: "user_123",
                prompt: text
            })

            // console.log("Response received:")
            // console.log(res.data)

            const responseText = res.data.business_output || res.data.error || "No response received.";
            setMessages([...currentMessages, { role: "assistant", text: responseText }])

            // const agentOutputs = res.data.agents
            // Object.entries(agentOutputs).forEach(([agent, text]) => {
            //     setMessages(prev => [
            //         ...prev,
            //         {
            //             role: "assistant",
            //             text: `${agent}:\n${text}`
            //         }
            //     ])
            // })

        } catch (error) {
            console.error("API Error:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isLoading) {
            setLoadingMessageIndex(0)
            interval = setInterval(() => {
                setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length)
            }, 4500)
        }
        return () => clearInterval(interval)
    }, [isLoading])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    useEffect(() => {
        const changeModel = async () => {
            try {
                const res = await axios.post("http://localhost:8080/change-model", {
                    model
                })
                toast.success(res.data.message)
            } catch (error) {
                console.error("API Error:", error)
                toast.error("Failed to change model")
                setModel(prevModel)
            }
        }
        changeModel()
    }, [model])

    return (
        <div className="flex flex-col h-full w-full min-w-0 bg-background">
            <div className="flex-1 overflow-y-auto pt-16 px-4 pb-4 flex flex-col items-center">
                {messages.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-4 -mt-16">
                        <div className="size-20 relative overflow-hidden">
                            {/* <NextImage
                                src="/logo1.png"
                                alt="CurioGenius Logo"
                                fill
                                className="object-cover"
                                priority
                            /> */}
                            <CurioGeniusLogo className="text-primary" />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-foreground">
                            CurioGenius
                        </h1>
                        <p className="text-muted-foreground text-center max-w-sm">
                            Your intelligent companion for business insights and creative problem-solving.
                        </p>
                    </div>
                ) : (
                    <>
                        <Conversation className="w-full">
                            <ConversationContent>
                                {messages.map((message, index) => (
                                    <Message from={message.role} key={index}>
                                        <MessageContent className="break-words max-w-full">
                                            <MessageResponse className="break-words overflow-hidden max-w-full text-foreground/90 leading-relaxed">
                                                {message.text}
                                            </MessageResponse>
                                        </MessageContent>
                                    </Message>
                                ))}
                            </ConversationContent>
                            <ConversationScrollButton />
                            
                        </Conversation>
                        {isLoading && (
                            <div className="mt-4 break-words w-full px-4">
                                <Shimmer>
                                    {loadingMessages[loadingMessageIndex]}
                                </Shimmer>
                            </div>
                        )}
                    </>
                )}
                {messages.some((m) => m.role === "assistant") && <ApproveAgent />}
                <div ref={messagesEndRef} />
            </div>

            <div className="w-full px-8 pb-8 pt-4 bg-background z-10 shrink-0">
                <PromptInput onSubmit={(e) => onSubmit(e)} >
                    <PromptInputBody>
                        <PromptInputTextarea
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
                            value={text}
                        />
                    </PromptInputBody>

                    <PromptInputFooter>
                        <PromptInputTools>
                            <ModelSelector>
                                <ModelSelectorTrigger
                                    render={
                                        <button className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors outline-none h-8 rounded-md" />
                                    }
                                >
                                    <ModelSelectorLogo provider={selectedModel.provider} />
                                    <span>{selectedModel.name}</span>
                                    <ChevronDown className="size-3 text-muted-foreground" />
                                </ModelSelectorTrigger>
                                <ModelSelectorContent>
                                    <ModelSelectorInput placeholder="Search models..." />
                                    <ModelSelectorList>
                                        <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
                                        <ModelSelectorGroup heading="Mistral">
                                            {models.map((m) => (
                                                <ModelSelectorItem
                                                    key={m.id}
                                                    onSelect={() => { setPrevModel(model); setModel(m.id) }}
                                                    value={m.id}
                                                    disabled={m.provider === "google"}
                                                >
                                                    <ModelSelectorLogo provider={m.provider} />
                                                    <ModelSelectorName>{m.name}</ModelSelectorName>
                                                    <ModelSelectorLogoGroup><ModelSelectorLogo provider={m.provider} /></ModelSelectorLogoGroup>
                                                    {selectedModel === m ? <Check className="ml-auto size-4" /> : <div className="ml-auto size-4" />}
                                                </ModelSelectorItem>
                                            ))}
                                        </ModelSelectorGroup>
                                    </ModelSelectorList>
                                </ModelSelectorContent>
                            </ModelSelector>
                        </PromptInputTools>
                        <PromptInputSubmit disabled={isLoading || !text.trim()} />
                    </PromptInputFooter>
                </PromptInput>
            </div>
        </div>
    )
}

export default ChatPage