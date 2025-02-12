// @ts-nocheck
import DefaultLayout from "@/layouts/default";
import ChatPanel from "@/components/ChatPanel";
import { Button } from "@heroui/button";
import { useState } from "react";

// User Information Panel Component
const UserInfoPanel = ({ isExpanded, setIsExpanded }) => {
  const userInfo = [
    { label: "User ID", value: "" },
    { label: "Name", value: "" },
    { label: "SSN", value: "" },
    { label: "Address", value: "" },
    { label: "Date Of Birth", value: "" },
    { label: "Email", value: "" },
    { label: "Phone Number", value: "" },
  ];

  return (
    <div className="bg-zinc-900 rounded-xl p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-white text-lg sm:text-xl">User Information</h2>
        <Button
          isIconOnly
          variant="light"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sky-400">
        </Button>
      </div>
      <div className="space-y-4">
        {userInfo.map((item, index) => (
          <div key={index} className="text-gray-300 text-sm sm:text-base">
            <p>{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function IndexPage() {

  const [isExpanded, setIsExpanded] = useState();

  
  return (
    <DefaultLayout>
      <main className="max-w-7xl mx-auto p-4 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <UserInfoPanel
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
          />
          <ChatPanel />
        </div>
      </main>
    </DefaultLayout>
  );
}
