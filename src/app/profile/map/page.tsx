import dynamic from "next/dynamic";

const UserMap = dynamic(() => import("../../../components/UserMap"), {
  ssr: false,
});

export default function Page() {
  return <UserMap />;
}
