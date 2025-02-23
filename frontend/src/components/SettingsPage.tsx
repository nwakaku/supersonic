import { useEffect, useState } from "react";
import { Button, Input, Progress, Card, CardBody } from "@heroui/react";
import { Check, ChevronRight, ChevronLeft, ExternalLink } from "lucide-react";
import { AccordionItem, Accordion } from "@heroui/react";
import { useNavigate } from "react-router-dom";


const SettingsPage = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    sonic: { privateKey: "" },
    twitter: {
      userId: "",
      username: "",
      consumerKey: "",
      consumerSecret: "",
      accessToken: "",
      accessTokenSecret: "",
    },
    goat: {
      rpcUrl: "",
      privateKey: "",
    },
    ai: {
      alloraKey: "",
      togetherKey: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useNavigate();

  const formatEnvData = (formData: any) => {
    return `
    SONIC_PRIVATE_KEY=${formData.sonic.privateKey}
    GOAT_RPC_URL=${formData.goat.rpcUrl}
    GOAT_PRIVATE_KEY=${formData.goat.privateKey}
    TWITTER_USER_ID=${formData.twitter.userId}
    TWITTER_USERNAME=${formData.twitter.username}
    TWITTER_CONSUMER_KEY=${formData.twitter.consumerKey}
    TWITTER_CONSUMER_SECRET=${formData.twitter.consumerSecret}
    TWITTER_ACCESS_TOKEN=${formData.twitter.accessToken}
    TWITTER_ACCESS_TOKEN_SECRET=${formData.twitter.accessTokenSecret}
    ALLORA_KEY=${formData.ai.alloraKey}
    TOGETHER_KEY=${formData.ai.togetherKey}
    `.trim();
  };

  useEffect(() => {
    // Check if settings exist in localStorage
    const savedSettings = localStorage.getItem("settings");
    if (savedSettings) {
      router("/dashboard");
    }
  }, [router]);

  const steps = [
    { title: "Blockchain Setup", type: "blockchain" },
    { title: "Social Media", type: "social" },
    { title: "AI Providers", type: "ai" },
    { title: "Review", type: "review" },
  ];

  const renderInstructions = (type: string) => {
    switch (type) {
      case "blockchain":
        return (
          <Accordion variant="bordered" className="w-full mb-4">
            <AccordionItem
              value="sonic"
              title="How to get your Sonic Private Key:"
            >
              <ol className="list-decimal ml-4 space-y-2">
                <li>Open your Sonic wallet</li>
                <li>Go to Settings → Security</li>
                <li>Select &ldquo;Export Private Key&ldquo;</li>
                <li>Enter your password to reveal the key</li>
                <li>Copy the key in base58 format</li>
              </ol>
            </AccordionItem>
          </Accordion>
        );
      case "social":
        return (
          <Accordion variant="bordered" className="w-full mb-4">
            <AccordionItem value="twitter" title="Twitter Setup Instructions">
              <ol className="list-decimal ml-4 space-y-2">
                <li>
                  Visit{" "}
                  <a
                    href="https://developer.twitter.com/en/portal/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-warning hover:text-blue-600 inline-flex items-center"
                  >
                    Twitter Developer Portal
                    <ExternalLink className="ml-1 h-4 w-4" />
                  </a>
                </li>
                <li>Create a new project and app</li>
                <li>Enable OAuth 1.0a with read/write permissions</li>
                <li>
                  Copy your API credentials from the &ldquo;Keys and Tokens&ldquo; tab
                </li>
              </ol>
            </AccordionItem>
          </Accordion>
        );
      case "ai":
        return (
          <Card className="mb-4">
            <CardBody>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold">Allora API Key:</h4>
                  <a
                    href="https://developer.upshot.xyz/signin"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-warning hover:text-blue-600 inline-flex items-center"
                  >
                    Upshot Developer Portal
                    <ExternalLink className="ml-1 h-4 w-4" />
                  </a>
                </div>
                <div>
                  <h4 className="text-lg font-semibold">Together AI Key:</h4>
                  <a
                    href="https://api.together.xyz/settings/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-warning hover:text-blue-600 inline-flex items-center"
                  >
                    Together AI Dashboard
                    <ExternalLink className="ml-1 h-4 w-4" />
                  </a>
                </div>
              </div>
            </CardBody>
          </Card>
        );
      default:
        return null;
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            {renderInstructions("blockchain")}
            <Input
              type="password"
              placeholder="Enter your Sonic private key"
              value={formData.sonic.privateKey}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  sonic: { ...formData.sonic, privateKey: e.target.value },
                })
              }
            />
            <Input
              placeholder="Enter your Goat RPC provider URL"
              value={formData.goat.rpcUrl}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  goat: { ...formData.goat, rpcUrl: e.target.value },
                })
              }
            />
            <Input
              type="password"
              placeholder="Enter your Goat wallet private key"
              value={formData.goat.privateKey}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  goat: { ...formData.goat, privateKey: e.target.value },
                })
              }
            />
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            {renderInstructions("social")}
            <Input
              placeholder="Enter your Twitter User ID"
              value={formData.twitter.userId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  twitter: { ...formData.twitter, userId: e.target.value },
                })
              }
            />
            <Input
              placeholder="@username"
              value={formData.twitter.username}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  twitter: { ...formData.twitter, username: e.target.value },
                })
              }
            />
            <Input
              type="password"
              placeholder="Enter your Twitter Consumer Key"
              value={formData.twitter.consumerKey}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  twitter: { ...formData.twitter, consumerKey: e.target.value },
                })
              }
            />
            <Input
              type="password"
              placeholder="Enter your Twitter Consumer Secret"
              value={formData.twitter.consumerSecret}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  twitter: {
                    ...formData.twitter,
                    consumerSecret: e.target.value,
                  },
                })
              }
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            {renderInstructions("ai")}
            <Input
              type="password"
              placeholder="Enter your Allora API key"
              value={formData.ai.alloraKey}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  ai: { ...formData.ai, alloraKey: e.target.value },
                })
              }
            />
            <Input
              type="password"
              placeholder="Enter your Together AI key"
              value={formData.ai.togetherKey}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  ai: { ...formData.ai, togetherKey: e.target.value },
                })
              }
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <Card>
              <CardBody>
                <h3 className="text-xl font-semibold mb-4">
                  Configuration Summary
                </h3>
                <div className="space-y-2">
                  <p className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    Blockchain credentials configured
                  </p>
                  <p className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    Twitter integration setup
                  </p>
                  <p className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    AI provider keys added
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  const handleNext = async () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setIsLoading(true);
      setError("");

      try {
        // Save to localStorage
        localStorage.setItem("settings", JSON.stringify(formData));

        const response = await fetch(
          "https://8000-nwakaku-supersonic-nju2g18jq5m.ws-eu117.gitpod.io/save-env",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          }
        );

        if (response.ok) {
          console.log("Environment variables saved successfully!");
          router("/dashboard");
        } else {
          const errorData = await response.json();
          setError(
            errorData.message ||
              "Failed to save environment variables. Please try again."
          );
          // Remove from localStorage if server save fails
          localStorage.removeItem("settings");
        }
      } catch (error) {
        setError(
          "An error occurred while saving settings. Please check your connection and try again."
        );
        console.error("Error:", error);
        // Remove from localStorage if server save fails
        localStorage.removeItem("settings");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 flex justify-center items-center">Setup Your AI Assistant</h1>
        <Progress value={(step + 1) * (100 / steps.length)} className="h-2" color="warning"/>
      </div>

      <div className="flex gap-4 mb-8">
        {steps.map((s, i) => (
          <div
            key={i}
            className={`flex items-center ${
              i <= step ? "text-warning" : "text-gray-400"
            }`}
          >
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center
                ${i <= step ? "bg-warning text-white" : "bg-gray-200"}
              `}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className="ml-2 text-sm font-medium">{s.title}</span>
            {i < steps.length - 1 && <ChevronRight className="mx-2 h-4 w-4" />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        {renderStepContent()}
      </div>

      <div className="flex justify-between">
        <Button
          variant="bordered"
          onPress={handlePrevious}
          disabled={step === 0}
          className="flex items-center"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button onPress={handleNext} className="flex items-center">
          {step === steps.length - 1 ? "Save Settings" : "Next"}
          {step < steps.length - 1 && <ChevronRight className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
