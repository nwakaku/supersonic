//@ts-nocheck
import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  useDisclosure,
  Progress,
  Card,
  CardBody,
} from "@heroui/react";
import {
  Check,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
} from "lucide-react";
import { AccordionItem, Accordion } from "@heroui/react";


const OnboardingModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
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

  const formatEnvData = (formData : any) => {
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
          <Accordion variant="bordered">
            <AccordionItem
              key="twitter"
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
          <Accordion variant="bordered">
            <AccordionItem key="twitter" title="Twitter Setup Instructions">
              <ol className="list-decimal ml-4 space-y-2">
                <li>
                  Visit{" "}
                  <a
                    href="https://developer.twitter.com/en/portal/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary"
                  >
                    Twitter Developer Portal
                  </a>
                </li>
                <li>Create a new project and app</li>
                <li>Enable OAuth 1.0a with read/write permissions</li>
                <li>
                  Copy your API credentials from the &#34;Keys and Tokens&ldquo;
                  tab
                </li>
              </ol>
            </AccordionItem>
          </Accordion>
        );
      case "ai":
        return (
          <Card className="bg-default-50 my-4">
            <CardBody>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold">Allora API Key:</h4>
                  <p>
                    Visit{" "}
                    <a
                      href="https://developer.upshot.xyz/signin"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary"
                    >
                      Upshot Developer Portal
                    </a>
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold">Together AI Key:</h4>
                  <p>
                    Visit{" "}
                    <a
                      href="https://api.together.xyz/settings/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary"
                    >
                      Together AI Dashboard
                    </a>
                  </p>
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
              label="Sonic Private Key"
              type="password"
              placeholder="Enter your Sonic private key"
              value={formData.sonic.privateKey}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  sonic: { ...formData.sonic, privateKey: e.target.value },
                })
              }
              className="mb-4"
            />
            <Input
              label="Goat RPC URL"
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
              label="Goat Wallet Private Key"
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
              label="Twitter User ID"
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
              label="Twitter Username"
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
              label="Consumer Key"
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
              label="Consumer Secret"
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
              label="Allora API Key"
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
              label="Together AI Key"
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
            <Card className="bg-default-50">
              <CardBody>
                <h3 className="text-xl font-semibold mb-4">
                  Configuration Summary
                </h3>
                <div className="space-y-2">
                  <p>✓ Blockchain credentials configured</p>
                  <p>✓ Twitter integration setup</p>
                  <p>✓ AI provider keys added</p>
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
      try {
        // Send formData to the backend
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
          onClose();
        } else {
          console.error("Failed to save environment variables.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <>
      <Button
        onPress={onOpen}
        color="warning"
        size="lg"
        className="font-semibold"
      >
        Create Your AI Assistant
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="3xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold">Setup Your AI Assistant</h2>
            <Progress
              value={(step + 1) * (100 / steps.length)}
              className="mt-2"
              color="warning"
            />
          </ModalHeader>
          <ModalBody>
            <div className="flex gap-4 mb-6">
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
                    {i < step ? <Check size={16} /> : i + 1}
                  </div>
                  <span className="ml-2 text-sm">{s.title}</span>
                  {i < steps.length - 1 && (
                    <ChevronRight className="mx-2" size={16} />
                  )}
                </div>
              ))}
            </div>
            {renderStepContent()}
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onPress={handlePrevious}
              disabled={step === 0}
            >
              <ChevronLeft size={16} />
              Previous
            </Button>
            <Button color="warning" onPress={handleNext}>
              {step === steps.length - 1 ? "Finish" : "Next"}
              {step < steps.length - 1 && <ChevronRight size={16} />}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default OnboardingModal;
