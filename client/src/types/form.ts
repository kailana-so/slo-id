
import { FormData } from "@/types/note"; 

export type FormSubmitEvent = React.FormEvent<HTMLFormElement>;

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
    refCode?: string;
    setRefCode?: (refCode: string) => void;
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
    isEditable?: boolean;
}

export interface IdentificationFormProps {
    schema: IdentificationFormField[];
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    formData: FormData;
    loading: boolean;
    setSnackbar: (snackbar: { isOpen: boolean; message: string; type: 'success' | 'error' }) => void;
    type: string;   
}


