
import { ReactNode } from 'react';

export type ChildrenType = ReactNode;

export type FormSubmitEvent = React.FormEvent<HTMLFormElement>;

export type LayoutProps = {
    children: ChildrenType;
};

export interface Note {
    name?: string; // Optional since not all notes might have it
    createdAt?: number;

    [key: string]: any; // Allows any additional keys
}

export interface NotePin {
    name: string; 
    latitude: number;
    longitude: number;
    createdAt: number;
}

export type UserProps = {
    user_id: string;
    username: string | null;
    email: string | null;
    friendly_id: string;
    created_at: Date;
    updated_at: Date;
}

export type ProfileProps = {
    user_id: string;
    username: string;
    friendly_id: string;
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

export interface OptionField {
    name: string
    hex?: string
}

export interface IdentificationFormField {
    name: string;
    label: string;
    type: string;
    required: boolean;
    conditional?: string;
    options?: OptionField[]; 
}

export interface IdentificationFormProps {
    schema: IdentificationFormField[];
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    formData: Record<string, any>;
    loading: boolean
}

export type FormType = keyof typeof identificationFormSchema;

// types/userTypes.ts
import { User as FirebaseUser } from "firebase/auth"; // Import Firebase User type
import { identificationFormSchema } from '@/components/forms/identification/IdentificationFormSchema';

export type User = FirebaseUser | null; // The user can be a Firebase user or null
