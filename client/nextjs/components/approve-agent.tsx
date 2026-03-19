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


const ApproveAgent = () => {
    const [feedback, setFeedback] = useState("")
    
    const handleModify = () => {
        // In production, call respondToConfirmationRequest with approved: false
    };
    
    const handleApprove = () => {
        // In production, call respondToConfirmationRequest with approved: true

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
                            <Input className="mt-2" placeholder="Comment for any changes..." />
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
                    <ConfirmationAction onClick={handleModify} variant="outline">
                        Reject
                    </ConfirmationAction>
                    <ConfirmationAction onClick={handleApprove} variant="default">
                        Approve
                    </ConfirmationAction>
                </ConfirmationActions>
            </Confirmation>
        </div>
    )
};

export default ApproveAgent;