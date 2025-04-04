import dynamic from "next/dynamic";

const UserMap = dynamic(
    async () => {
        await new Promise(res => setTimeout(res, 1000)); // simulate load
        return import("@/components/UserMap");
    },
    {
        ssr: false,
        loading: () => <p>Loading map...</p>,
    }
);

export default function MapsPage() {
    return (
        <UserMap />
    );
}
