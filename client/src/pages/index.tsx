// @ts-nocheck
import ChatPanel from "@/components/ChatPanel";
import DefaultLayout from "@/layouts/default";
import { useState } from "react";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <main className="max-w-7xl mx-auto p-2 bg-white rounded-lg shadow-lg">
        <ChatPanel />
      </main>
    </DefaultLayout>
  );
}