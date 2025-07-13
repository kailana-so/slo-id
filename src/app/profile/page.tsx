"use client";

import React from "react";
import { SightingStatus } from "@/lib/db/dbHelpers";
import { useProfile } from "@/providers/ProfileProvider";
import { useStatusCount } from "@/hooks/useCountStatus";
import DrawIcon from '@mui/icons-material/Draw';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HikingIcon from '@mui/icons-material/Hiking';

export default function Page() {
    const { userData, loading } = useProfile();

    // Show loading state while fetching user data
    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="spinner"></div>
                <span className="ml-2">Loading...</span>
            </div>
        );
    }

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
                        <section className="grid grid-cols-4 gap-4 justify-items-stretch mt-2">
                            <div className="badge-item unselected flex flex-col items-center justify-center gap-1 m-4">
                                <SearchIcon></SearchIcon>
                                <p>Sightings</p>
                                <h4>{draftCount?.count}</h4>
                            </div>
                            <div className="badge-item unselected flex flex-col items-center justify-center gap-1 m-4">
                                <DrawIcon></DrawIcon>
                                <p>Drafts</p>
                                <h4>{draftCount?.count}</h4>
                            </div>
                            <div className="badge-item unselected flex flex-col items-center justify-center gap-1 m-4">
                                <CheckCircleIcon></CheckCircleIcon>
                                <p>Ids</p>
                                <h4>{draftCount?.count}</h4>
                            </div>
                            <div className="badge-item unselected flex flex-col items-center justify-center gap-1 m-4">
                                <HikingIcon></HikingIcon>
                                <p>Distance</p>
                                <h4>{draftCount?.count}km</h4>
                            </div>
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
