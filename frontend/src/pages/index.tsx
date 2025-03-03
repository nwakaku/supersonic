import { Link } from "@heroui/link";

import DefaultLayout from "@/layouts/default";

import { Button } from "@heroui/button";
import { Card, CardBody, Image } from "@heroui/react";
import { LucidePhoneCall, LucidePizza, LucideRadioTower } from "lucide-react";

export default function IndexPage() {
  return (
    <DefaultLayout>
      {/* Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-16 bg-gray-50 rounded-sm">
        <section className="flex flex-col justify-center px-8">
          <h1 className="text-6xl font-extrabold tracking-tighter md:text-7xl text-gray-900">
            Talk to AI Like <span className="text-warning">Never Before</span>
          </h1>
          <h2 className="text-2xl font-normal tracking-tight text-gray-600 mt-4">
            Your Blockchain & AI Assistant—Just a Phone Call Away
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            💡 Load Agents. Manage Crypto. Automate Tasks. Get Advice.
          </p>
          <div className="flex flex-row gap-4 mt-6">
            <Button
              as={Link}
              href="/settings"
              variant="solid"
              size="lg"
              className="font-semibold bg-warning hover:bg-warning/90 text-white"
            >
              Get Started
            </Button>
            <Button
              as={Link}
              href="/demo"
              variant="bordered"
              size="lg"
              className="font-semibold text-gray-700 border-gray-700 hover:bg-gray-100"
            >
              Watch Demo
            </Button>
          </div>
        </section>
        <section className="flex flex-col items-center justify-center px-8">
          <Image
            alt="AI Phone Assistant"
            className="w-full rounded-lg object-cover shadow-lg"
            height={400}
            src="/flipgrammy.jpg"
            width={680}
          />
          <p className="mt-4 text-gray-600">Even Your Granny can use it.</p>
        </section>
      </div>

      {/* How It Works Section */}
      <div className="mt-16 bg-gray-100 py-16 rounded-sm">
        <h2 className="text-4xl text-warning font-bold mb-8 text-center">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8">
          <Card className="p-6 bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardBody>
              <span className="flex items-center gap-2 mb-4">
                <LucidePizza className="text-gray-700" />
                <h3 className="text-2xl font-semibold text-gray-800">
                  Get Your AI Phone Agent
                </h3>
              </span>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Instantly create your phone assistant.</li>
                <li>Purchase and configure your custom number</li>
              </ul>
            </CardBody>
          </Card>
          <Card className="p-6 bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardBody>
              <span className="flex items-center gap-2 mb-4">
                <LucideRadioTower className="text-gray-700" />
                <h3 className="text-2xl font-semibold text-gray-800">
                  Connect & Customize
                </h3>
              </span>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>
                  Seamlessly integrate with Twitter, blockchain networks, and AI
                  functions
                </li>
                <li>Personalize your assistant with custom automations</li>
              </ul>
            </CardBody>
          </Card>
          <Card className="p-6 bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardBody>
              <span className="flex items-center gap-2 mb-4">
                <LucidePhoneCall className="text-gray-700" />
                <h3 className="text-2xl font-semibold text-gray-800">
                  Call & Command
                </h3>
              </span>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Manage blockchain tasks</li>
                <li>Start & stop AI agents</li>
                <li>Get financial insights</li>
                <li>Execute actions in real time</li>
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Who Is This For Section */}
      <div className="mt-16 bg-gray-50 py-16 rounded-sm">
        <h2 className="text-4xl font-bold mb-8 text-center text-gray-900">
          Who Is This For?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8">
          <Card className="p-6 bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardBody>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                ✅ Crypto Enthusiasts
              </h3>
              <p className="text-gray-600">
                Manage your blockchain transactions hands-free
              </p>
            </CardBody>
          </Card>
          <Card className="p-6 bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardBody>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                ✅ Senior Citizens
              </h3>
              <p className="text-gray-600">
                Simplified AI for effortless interactions
              </p>
            </CardBody>
          </Card>
          <Card className="p-6 bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardBody>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                ✅ Students & Entrepreneurs
              </h3>
              <p className="text-gray-600">
                Quick financial insights & automation
              </p>
            </CardBody>
          </Card>
          <Card className="p-6 bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardBody>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                ✅ Rural Farmers & Business Owners
              </h3>
              <p className="text-gray-600">
                Get blockchain access without internet hassles
              </p>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* AI That Listens Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-16 mt-16 bg-gray-100 rounded-sm">
        <section className="flex flex-col items-center justify-center px-8">
          <Image
            alt="AI Phone Assistant"
            className="w-full rounded-lg object-cover shadow-lg"
            height={400}
            src="https://cdn.dribbble.com/userupload/17524831/file/original-056cb479253bdd985448ac8dcff70dab.jpg?resize=1024x768&vertical=center"
            width={680}
          />
          <p className="mt-4 text-gray-600">Even Your Granny can use it.</p>
        </section>
        <div className="mt-16 text-center px-8">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            📞 AI That Listens & Executes
          </h2>
          <p className="text-xl mb-8 text-gray-600">
            No apps. No typing. Just talk to your assistant and get things done
            in seconds.
          </p>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="mt-16 text-center bg-gray-50 py-16 rounded-sm">
        <h2 className="text-4xl font-bold mb-4 text-gray-900">
          ⚡ Get Started Today!
        </h2>
        <p className="text-xl mb-8 text-gray-600">
          Set up your AI phone agent in minutes and make your first call
        </p>
        <div className="flex justify-center gap-4">
          <Button
            as={Link}
            href="/signup"
            color="primary"
            size="lg"
            className="font-semibold bg-warning hover:bg-warning/90 text-white"
          >
            Create Your AI Assistant Now
          </Button>
          <Button
            as={Link}
            href="/learn-more"
            variant="bordered"
            size="lg"
            className="font-semibold text-gray-700 border-gray-700 hover:bg-gray-100"
          >
            Learn More
          </Button>
        </div>
      </div>
    </DefaultLayout>
  );
}
