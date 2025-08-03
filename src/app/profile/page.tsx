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
            error: draftError,
        } = useStatusCount(SightingStatus.DRAFT, userData?.userId);
    const {
            data: noteCount,
            // error: noteError
    } = useStatusCount(SightingStatus.SIGHTING, userData?.userId);
    const {
        data: idCount,
        // error: idError
} = useStatusCount(SightingStatus.IDENTIFICATION, userData?.userId);


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
                        <section className="badge-grid">
                            <div className="trend-item">
                                <SearchIcon></SearchIcon>
                                <p className="hidden sm:block">Notes</p>
                                <p>{noteCount?.count}</p>
                            </div>
                            <div className="trend-item">
                                <DrawIcon></DrawIcon>
                                <p className="hidden sm:block">Drafts</p>
                                <p>{draftCount?.count}</p>
                            </div>
                            <div className="trend-item">
                                <CheckCircleIcon></CheckCircleIcon>
                                <p className="hidden sm:block">Ids</p>
                                <p>{idCount?.count}</p>
                            </div>
                            <div className="trend-item">
                                <HikingIcon></HikingIcon>
                                <p className="hidden sm:block">Distance</p>
                                <p>{draftCount?.count}km</p>
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
