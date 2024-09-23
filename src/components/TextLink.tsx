import React from "react";
import { useRouter } from "next/navigation"; 

interface TextLinkProps {
    linkText: string
    route: string
}

const TextLink: React.FC<TextLinkProps> = ({linkText, route }) => {
    const router = useRouter();

    return (
        <button className="hover:text-blue-300 ps-2 underline" onClick={() => router.push(route)}>{linkText}</button>
    )
}
export default TextLink;