//@ts-nocheck
import { useState, useEffect } from "react";
import Retell from "retell-sdk";
import { Card, CardHeader, CardBody, Badge } from "@heroui/react";
import {
  Mic,
  Phone,
  User2,
  RadioTower,
  BarChart3,
  Clock,
  PhoneCall,
  Users,
} from "lucide-react";
import { RetellWebClient } from "retell-client-js-sdk";

const Dashboard = () => {
  const [calls, setCalls] = useState([]);
  const [selectedCall, setSelectedCall] = useState(null);
  const [retellWebClient] = useState(() => new RetellWebClient());
  const [liveTranscript, setLiveTranscript] = useState([]);
  const [isCallActive, setIsCallActive] = useState(false);
  const [metrics, setMetrics] = useState({
    totalCalls: 0,
    activeCalls: 0,
    avgDuration: 0,
    successRate: 0,
  });
  const [phoneNumbers, setPhoneNumbers] = useState([]); // New state for phone numbers

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

        // Calculate metrics
        const active = callResponses.filter(
          (call) => call.call_status === "ongoing"
        ).length;
        const avgDur =
          callResponses.reduce(
            (acc, call) =>
              acc + (call.end_timestamp - call.start_timestamp) / 1000,
            0
          ) / callResponses.length;
        const successRate =
          (callResponses.filter((call) => call.call_analysis?.call_successful)
            .length /
            callResponses.length) *
          100;

        setMetrics({
          totalCalls: callResponses.length,
          activeCalls: active,
          avgDuration: Math.round(avgDur),
          successRate: Math.round(successRate),
        });

        if (callResponses.length > 0 && !selectedCall) {
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

  // ... [Previous useEffect for transcript listeners remains the same]
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

  // Fetch phone numbers
  useEffect(() => {
    const fetchPhoneNumbers = async () => {
      const client = new Retell({
        apiKey: "key_cea07d3b19242e95aa9cc20c9215",
      });

      try {
        const phoneNumberResponses = await client.phoneNumber.list();
        console.log(phoneNumberResponses);
        setPhoneNumbers(phoneNumberResponses);
      } catch (error) {
        console.error("Error fetching phone numbers:", error);
      }
    };

    fetchPhoneNumbers();
  }, []);

  const MetricCard = ({ icon: Icon, title, value, suffix }) => (
    <Card className="bg-gray-50">
      <CardBody className="p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Icon className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-xl font-semibold text-gray-800">
              {value}
              {suffix}
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );

  return (
    <div className="flex h-screen bg-gray-300 rounded-md p-3">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Call Center</h2>
        </div>
        <div className="p-4">
          <nav className="space-y-2">
            <a
              href="#"
              className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg text-blue-700"
            >
              <PhoneCall className="w-5 h-5" />
              <span>Calls</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-2 p-2 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <BarChart3 className="w-5 h-5" />
              <span>Analytics</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-2 p-2 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <Users className="w-5 h-5" />
              <span>Agents</span>
              {phoneNumbers[0]}
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Dashboard Header */}

        {/* Main Chat Panel */}
        <div className="flex-1 flex overflow-hidden">
          {/* Call List */}
          <div className="w-80 border-r border-gray-200 bg-gray-50 overflow-y-auto [&::-webkit-scrollbar]:hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800">Recent Calls</h3>
            </div>
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
                      className={`w-5 h-5 ${call.call_status === "ongoing" ? "text-green-500" : "text-gray-500"}`}
                    />
                    <div>
                      <p className="font-medium text-gray-800">
                        {call.agent_phone_number || "Unknown Number"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(call.start_timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={
                      call.call_status === "ongoing"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100"
                    }
                  >
                    {call.call_status}
                  </Badge>
                </div>
              </button>
            ))}
          </div>

          {/* Chat Transcript */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
            {/* ... [Previous chat transcript section remains the same] */}
            {selectedCall?.call_status === "ongoing" ? (
              <>
                {liveTranscript.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <Card className="bg-gray-50 shadow-sm">
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
                        message.role === "agent"
                          ? "justify-start"
                          : "justify-end"
                      }`}
                    >
                      <Card
                        className={`max-w-[80%] ${
                          message.role === "agent"
                            ? "bg-gray-50"
                            : "bg-blue-500"
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
              formatTranscript(selectedCall.transcript).map(
                (message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "agent" ? "justify-start" : "justify-end"
                    }`}
                  >
                    <Card
                      className={`max-w-[80%] ${
                        message.role === "agent" ? "bg-gray-50" : "bg-blue-500"
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
                )
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
