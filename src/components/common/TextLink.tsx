import React from "react";
import { useRouter } from "next/navigation"; 

interface TextLinkProps {
    linkText: string
    route: string
}

const TextLink: React.FC<TextLinkProps> = ({linkText, route }) => {
    const router = useRouter();

    return (
        <button className="menu-item pl-2" onClick={() => router.push(route)}>{linkText}</button>
    )
}
export default TextLink;