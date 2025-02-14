"use client"; // Marking as a Client Component

import React, { useEffect, useState } from "react";
import { getCurrentUser, getUser } from "@/services/userService";
import { useProfile } from "@/providers/ProfileProviders";

export default function UserMap() {
    const { userData } = useProfile();
    return (
        <div>
            <p>MAP COMPONENT</p>
            <p>Your referrer code is: <b>{userData?.friendly_id}</b></p>
        </div>
    );
}
