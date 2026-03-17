"use client"
import { Message, MessageContent, MessageResponse } from "./ai-elements/message";
import { 
    PromptInput, 
    PromptInputBody, 
    PromptInputFooter, 
    PromptInputSelect, 
    PromptInputSelectContent, 
    PromptInputSelectItem, 
    PromptInputSelectTrigger, 
    PromptInputSelectValue, 
    PromptInputSubmit, 
    PromptInputTextarea, 
    PromptInputTools 
} from "./ai-elements/prompt-input";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Conversation, ConversationContent, ConversationScrollButton } from "./ai-elements/conversation";
import { Shimmer } from "./ai-elements/shimmer";
import NextImage from "next/image";
import { CurioGeniusLogo } from "./logo";

const models = [
    { id: "gpt-4o", name: "GPT-4o" },
    { id: "claude-opus-4", name: "Claude 4 Opus" },
];

const ChatPage = () => {

    // const { messages, sendMessage } = useChat({
    //     transport: new DefaultChatTransport({
    //         api: "/api/chat"
    //     })
    // });
    const [text, setText] = useState("")
    const [model, setModel] = useState<string>(models[0].id);
    const [messages, setMessages] = useState<{ role: "user" | "assistant" | "system", text: string }[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [loadingMessageIndex, setLoadingMessageIndex] = useState(0)
    const messagesEndRef = useRef<HTMLDivElement>(null)

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

            console.log("Sending request with messages:", currentMessages)
            const res = await axios.post("http://localhost:8080/invocations", {
                messages: currentMessages
            })

            console.log("Response received:")
            console.log(res.data.content)

            setMessages([...currentMessages, { role: "assistant", text: res.data.content }])

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
                            <PromptInputSelect
                                onValueChange={(value: unknown) => {
                                    setModel(value as string);
                                }}
                                value={model}
                            >
                                <PromptInputSelectTrigger>
                                    <PromptInputSelectValue />
                                </PromptInputSelectTrigger>
                                <PromptInputSelectContent>
                                    {models.map((model) => (
                                        <PromptInputSelectItem key={model.id} value={model.id}>
                                            {model.name}
                                        </PromptInputSelectItem>
                                    ))}
                                </PromptInputSelectContent>
                            </PromptInputSelect>
                        </PromptInputTools>
                        <PromptInputSubmit disabled={isLoading || !text.trim()} />
                    </PromptInputFooter>
                </PromptInput>
            </div>
        </div>
    )
}

export default ChatPage