/* eslint-disable padding-line-between-statements */
//@ts-nocheck
import React, { useState, useEffect } from "react";
import Retell from "retell-sdk";
import { Card, CardBody, Badge } from "@nextui-org/react";
import { Mic, Phone, User2, RadioTower } from "lucide-react";
import { RetellWebClient } from "retell-client-js-sdk";

const ChatPanel = () => {
  const [calls, setCalls] = useState([]);
  const [selectedCall, setSelectedCall] = useState(null);
  const [retellWebClient] = useState(() => new RetellWebClient());
  const [liveTranscript, setLiveTranscript] = useState([]);
  const [isCallActive, setIsCallActive] = useState(false);

  const formatTranscript = (transcript) => {
    if (!transcript) return [];
    return transcript
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => {
        const [role, ...content] = line.split(":");
        return {
          role: role.toLowerCase().trim(),
          content: content.join(":").trim(),
        };
      });
  };

  useEffect(() => {
    const fetchCalls = async () => {
      const client = new Retell({
        apiKey: "key_cea07d3b19242e95aa9cc20c9215",
      });

      try {
        const callResponses = await client.call.list();
        setCalls(callResponses);
        if (callResponses.length > 0) {
          setSelectedCall(callResponses[0]);
        }
      } catch (error) {
        console.error("Error fetching calls:", error);
      }
    };

    fetchCalls();

    const intervalId = setInterval(fetchCalls, 30000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!selectedCall || selectedCall.call_status !== "ongoing") {
      setIsCallActive(false);
      return;
    }

    console.log(
      "Setting up transcript listeners for call:",
      selectedCall.call_id
    );
    setIsCallActive(true);

    // Set up event listeners for transcript updates
    retellWebClient.on("update", (update) => {
      console.log("Received transcript update:", update);
      if (update?.transcript) {
        setLiveTranscript((current) => {
          const newTranscripts = formatTranscript(update.transcript);
          const existingIds = new Set(current.map((t) => t.content));
          const uniqueNewTranscripts = newTranscripts.filter(
            (t) => !existingIds.has(t.content)
          );
          return [...current, ...uniqueNewTranscripts];
        });
      }
    });

    // Error handling
    retellWebClient.on("error", (error) => {
      console.error("Transcript listener error:", error);
      setError(`Error receiving updates: ${error.message || "Unknown error"}`);
    });

    return () => {
      console.log("Cleaning up transcript listeners");
      retellWebClient.removeAllListeners();
    };
  }, [selectedCall]);

  const getStatusColor = (status) => {
    switch (status) {
      case "ongoing":
        return "text-green-500";
      case "registered":
        return "text-yellow-500";
      case "ended":
        return "text-gray-500";
      case "error":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusIndicator = (status) => {
    if (status === "ongoing") {
      return (
        <div className="flex items-center space-x-1">
          <RadioTower className="w-4 h-4 text-green-500 animate-pulse" />
          <span className="text-green-500 text-sm">Live</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex h-screen bg-gray-100 rounded-lg overflow-hidden shadow-lg">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Call History</h2>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-64px)]">
          {calls.map((call) => (
            <button
              key={call.call_id}
              onClick={() => setSelectedCall(call)}
              className={`w-full text-left p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200 ${
                selectedCall?.call_id === call.call_id ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Phone
                    className={`w-5 h-5 ${getStatusColor(call.call_status)}`}
                  />
                  <div>
                    <p className="font-medium text-gray-800">
                      Call {call.call_id.slice(0, 14)}...
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(call.start_timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                {getStatusIndicator(call.call_status)}
              </div>
              <Badge
                className="mt-2"
                color={
                  call.call_status === "ongoing"
                    ? "success"
                    : call.call_status === "ended"
                      ? "default"
                      : call.call_status === "error"
                        ? "danger"
                        : "warning"
                }
              >
                {call.call_status}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <header className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-800">
                Call Transcript
              </h1>
              {selectedCall && (
                <span className="text-sm text-gray-500">
                  Duration:{" "}
                  {(
                    (selectedCall.end_timestamp -
                      selectedCall.start_timestamp) /
                    1000
                  ).toFixed(0)}
                  s
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Mic className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-500">Recording Available</span>
            </div>
          </div>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {selectedCall?.call_status === "ongoing" ? (
            <>
              {liveTranscript.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <Card className="bg-white shadow-sm">
                    <CardBody className="text-center p-6">
                      <RadioTower className="w-8 h-8 text-green-500 animate-pulse mx-auto mb-2" />
                      <p className="text-gray-800">Call in progress</p>
                      <p className="text-sm text-gray-500">
                        Waiting for conversation to begin...
                      </p>
                    </CardBody>
                  </Card>
                </div>
              ) : (
                liveTranscript.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "agent" ? "justify-start" : "justify-end"
                    }`}
                  >
                    <Card
                      className={`max-w-[80%] ${
                        message.role === "agent" ? "bg-white" : "bg-blue-500"
                      } shadow-sm`}
                    >
                      <CardBody
                        className={`p-4 ${
                          message.role === "user"
                            ? "text-white"
                            : "text-gray-800"
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          {message.role === "agent" ? (
                            <Mic className="w-4 h-4 text-gray-500" />
                          ) : (
                            <User2 className="w-4 h-4 text-blue-300" />
                          )}
                          <span className="font-medium">
                            {message.role === "agent" ? "AI Agent" : "User"}
                          </span>
                        </div>
                        <p>{message.content}</p>
                      </CardBody>
                    </Card>
                  </div>
                ))
              )}
            </>
          ) : (
            selectedCall?.transcript &&
            formatTranscript(selectedCall.transcript).map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "agent" ? "justify-start" : "justify-end"
                }`}
              >
                <Card
                  className={`max-w-[80%] ${
                    message.role === "agent" ? "bg-white" : "bg-blue-500"
                  } shadow-sm`}
                >
                  <CardBody
                    className={`p-4 ${
                      message.role === "user" ? "text-white" : "text-gray-800"
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      {message.role === "agent" ? (
                        <Mic className="w-4 h-4 text-gray-500" />
                      ) : (
                        <User2 className="w-4 h-4 text-blue-300" />
                      )}
                      <span className="font-medium">
                        {message.role === "agent" ? "AI Agent" : "User"}
                      </span>
                    </div>
                    <p>{message.content}</p>
                  </CardBody>
                </Card>
              </div>
            ))
          )}
        </div>

        {/* Call Summary */}
        {selectedCall?.call_analysis && (
          <footer className="p-6 bg-white border-t border-gray-200">
            <Card className="bg-gray-50 shadow-sm">
              <CardBody className="p-6">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Call Summary
                </h3>
                <p className="text-gray-700">
                  {selectedCall.call_analysis.call_summary}
                </p>
                <div className="mt-4 flex space-x-4 text-sm text-gray-500">
                  <span>
                    Sentiment: {selectedCall.call_analysis.user_sentiment}
                  </span>
                  <span>
                    Success:{" "}
                    {selectedCall.call_analysis.call_successful ? "Yes" : "No"}
                  </span>
                </div>
              </CardBody>
            </Card>
          </footer>
        )}
      </main>
    </div>
  );
};

export default ChatPanel;
