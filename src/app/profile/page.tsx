"use client";

import React from "react";
import { SightingStatus } from "@/lib/db/dbHelpers";
import { useProfile } from "@/providers/ProfileProvider";
import { useStatusCount } from "@/hooks/useCountStatus";
import DrawIcon from '@mui/icons-material/Draw';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function Page({ children }: { children: React.ReactNode }) {
    const { userData } = useProfile();

    const {
            data: draftCount,
            error
        } = useStatusCount(SightingStatus.DRAFT, userData?.userId );
    console.log(draftCount, "draftCount")
    console.log(error, "error")

    const renderPage = () => {
        if (userData?.username) {
            return (
                <section>
                    <div className="card">
                        <h3>Hi {userData.username}</h3> 
                        <p>Ref code: <b>{userData.friendlyId}</b></p>
                    </div>
                    <div className="card">
                        <h3>Trends</h3> 
                        <section className="grid grid-cols-3 gap-4 justify-items-stretch mt-2">
                            <div className="card-alt flex flex-col items-center justify-center gap-1 m-4">
                                <SearchIcon></SearchIcon>
                                <p>Notes</p>
                                <h4>{draftCount?.count}</h4>
                            </div>
                            <div className="card-alt flex flex-col items-center justify-center gap-1 m-4">
                                <DrawIcon></DrawIcon>
                                <p>Drafts</p>
                                <h4>{draftCount?.count}</h4>
                            </div>
                            <div className="card-alt flex flex-col items-center justify-center gap-1 m-4">
                                <CheckCircleIcon></CheckCircleIcon>
                                <p>Ids</p>
                                <h4>{draftCount?.count}</h4>
                            </div>
                            <div className="card"> <h4>{draftCount?.count}km</h4> </div>
                        </section>
                    </div>
                </section>
            );
        }
        return (
            <div>
                <p>Create a profile to start noticing.</p>
            </div>
        )
    }

    return (
        <div>
            {renderPage()}
        </div>
    );
}
