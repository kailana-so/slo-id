
import { User as FirebaseUser } from "firebase/auth"; // Import Firebase User type

export type UserProps = {
    userId: string;
    username: string | null;
    email: string | null;
    friendlyId: string;
    createdAt: Date;
    updatedAt: Date;
}

export type ProfileProps = {
    userId: string;
    username: string;
    friendlyId: string;
}

export type User = FirebaseUser | null; // The user can be a Firebase user or null
