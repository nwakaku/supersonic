import ChatPanel from "@/components/ChatPanel";
import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function Dashboard() {
  return (
    <DefaultLayout>
      <ChatPanel/>
    </DefaultLayout>
  );
}
