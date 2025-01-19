
import { ReactNode } from 'react';

export type ChildrenType = ReactNode;

export type FormSubmitEvent = React.FormEvent<HTMLFormElement>;

export type LayoutProps = {
    children: ChildrenType;
};

export type AddUserProps = {
    user_id: string;
    username: string | null;
    email: string | null;
    friendly_id: string;
    created_at: Date;
    updated_at: Date;
}

export type  AuthFormProps = {
    title: string;
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    error?: string;
    loading: boolean;
    isSignUp?: boolean;
    name?: string;
    setName?: (name: string) => void;
}

export interface UserDataProps {
    userData: any; // Update the type as needed
}

// types/userTypes.ts
import { User as FirebaseUser } from "firebase/auth"; // Import Firebase User type

export type User = FirebaseUser | null; // The user can be a Firebase user or null
