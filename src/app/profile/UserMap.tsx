"use client"; // Marking as a Client Component

import React, { useEffect, useState } from "react";
import { getCurrentUser, getUser } from "@/services/userService";
interface UserMapProps {
    userData: any; // Update the type as needed
}

export default function UserMap({ userData }: UserMapProps) {
    return (
        <div>
            <p>MAP COMPONENT</p>
            <p>Your referrer code is: <b>{userData.friendly_id}</b></p>
        </div>
    );
}
