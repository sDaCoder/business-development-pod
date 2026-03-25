"use client";

import {
    Confirmation,
    ConfirmationAccepted,
    ConfirmationAction,
    ConfirmationActions,
    ConfirmationRejected,
    ConfirmationRequest,
    ConfirmationTitle,
} from "@/components/ai-elements/confirmation";
import { CheckIcon, XIcon } from "lucide-react";
import { nanoid } from "nanoid";
import { Input } from "./ui/input";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";


const ApproveAgent = ({ 
    projectId, 
    isLoading, 
    setIsLoading,
    messages,
    setMessages,
    setBizAgentApproval
}: { 
    projectId: string, 
    isLoading: boolean, 
    setIsLoading: (value: boolean) => void 
    messages: { role: "user" | "assistant" | "system", text: string }[],
    setMessages: (value: { role: "user" | "assistant" | "system", text: string }[]) => void,
    setBizAgentApproval: (value: boolean) => void
}) => {
    const [feedback, setFeedback] = useState<string>("")

    const handleModify = async () => {
        // In production, call respondToConfirmationRequest with approved: false
        try {
            setFeedback("")
            setIsLoading(true)
            const res = await axios.post("http://localhost:8080/biz-agent-feedback", {
                project_id: projectId,
                action: "modify",
                feedback
            })
            setMessages([...messages, { role: res.data.role || "assistant", text: res.data.business_output || res.data.content }])
            toast.success("Your business plan has been modified.")
        } catch (error) {
            console.error("API Error:", error)
            toast.error("Failed to modify business plan")
        } finally {
            setIsLoading(false)
        }
    };

    const handleApprove = async () => {
        // In production, call respondToConfirmationRequest with approved: true
        try {
            setIsLoading(true)
            setBizAgentApproval(true)
            toast.success("Your business plan is being approved...")
            const res = await axios.post("http://localhost:8080/biz-agent-feedback", {
                project_id: projectId,
                action: "approve"
            })
            setMessages([...messages, { role: res.data.role || "assistant", text: res.data.content }])
        } catch (error) {
            console.error("API Error:", error)
            toast.error("Failed to approve business plan")
        } finally {
            setIsLoading(false)
        }

    };
    return (
        <div className="w-full px-8 pb-8 pt-4">
            <Confirmation className="" approval={{ id: nanoid() }} state="approval-requested">
                <ConfirmationTitle>
                    <ConfirmationRequest>
                        {/* This tool wants to execute a query on the production database:
                    <code className="mt-2 block rounded bg-muted p-2 text-sm">
                        SELECT * FROM users WHERE role = &apos;admin&apos;
                    </code> */}
                        <div className="w-full py-2">
                            Want any changes in the above generated business plan?
                            <Input
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                className="mt-2" placeholder="Comment for any changes..." />
                        </div>
                    </ConfirmationRequest>
                    {/* <ConfirmationAccepted>
                        <CheckIcon className="size-4 text-green-600 dark:text-green-400" />
                        <span>You approved this tool execution</span>
                    </ConfirmationAccepted>
                    <ConfirmationRejected>
                        <XIcon className="size-4 text-destructive" />
                        <span>You rejected this tool execution</span>
                    </ConfirmationRejected> */}
                </ConfirmationTitle>
                <ConfirmationActions>
                    <ConfirmationAction disabled={isLoading || !feedback.trim()} onClick={handleModify} variant="outline">
                        Modify
                    </ConfirmationAction>
                    <ConfirmationAction disabled={feedback.trim() !== ""} onClick={handleApprove} variant="default">
                        Approve
                    </ConfirmationAction>
                </ConfirmationActions>
            </Confirmation>
        </div>
    )
};

export default ApproveAgent;