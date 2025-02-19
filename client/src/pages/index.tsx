// @ts-nocheck
import ChatPanel from "@/components/ChatPanel";
import DefaultLayout from "@/layouts/default";
import { Button } from "@heroui/button";
import { useState } from "react";


export default function IndexPage() {

  const [isExpanded, setIsExpanded] = useState();


  return (
    <DefaultLayout>
      <main className="max-w-7xl mx-auto p-4 space-y-1">
        
          <ChatPanel />
      </main>
    </DefaultLayout>
  );
}
