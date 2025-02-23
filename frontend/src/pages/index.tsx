import { Link } from "@heroui/link";

import DefaultLayout from "@/layouts/default";

import { Button } from "@heroui/button";
import { Card, CardBody, Image } from "@heroui/react";
import { LucidePhoneCall, LucidePizza, LucideRadioTower } from "lucide-react";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-4 h-screen">
        <section className="flex flex-col justify-center">
          <h1 className="text-6xl font-extrabold tracking-tighter md:text-7xl">
            Talk to AI Like <span className="text-warning">Never Before</span>
          </h1>
          <h2 className="text-2xl font-normal tracking-tight text-muted-foreground mt-4">
            Your Blockchain & AI Assistant—Just a Phone Call Away
          </h2>
          <p className="mt-4 text-lg">
            💡 Load Agents. Manage Crypto. Automate Tasks. Get Advice.
          </p>
          <div className="flex flex-row gap-4 mt-6">
            <Button
              as={Link}
              href="/settings"
              variant="solid"
              size="lg"
              className="font-semibold bg-warning"
            >
              Get Started
            </Button>
            <Button
              as={Link}
              href="/demo"
              variant="bordered"
              size="lg"
              className="font-semibold"
            >
              Watch Demo
            </Button>
          </div>
        </section>
        <section className="flex flex-col items-center justify-center">
          <Image
            alt="AI Phone Assistant"
            className="w-full rounded-lg object-cover"
            height={400}
            src="/flipgrammy.jpg"
            width={680}
          />
          <p>Even Your Granny can use it.</p>
        </section>
      </div>

      {/* How It Works */}
      <div className="mt-8">
        <h2 className="text-4xl text-warning font-bold mb-8 text-center">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-4">
            <CardBody>
              <span className="flex item-center gap-2 mb-4">
                <LucidePizza />{" "}
                <h3 className="text-2xl font-semibold  ">
                  Get Your AI Phone Agent
                </h3>
              </span>

              <ul className="list-disc list-inside space-y-2">
                <li>Instantly create your phone assistant.</li>
                <li>Purchase and configure your custom number</li>
              </ul>
            </CardBody>
          </Card>
          <Card className="p-4">
            <CardBody>
              <span className="flex item-center gap-2 mb-4">
                <LucideRadioTower />
                <h3 className="text-2xl font-semibold ">Connect & Customize</h3>
              </span>

              <ul className="list-disc list-inside space-y-2">
                <li>
                  Seamlessly integrate with Twitter, blockchain networks, and AI
                  functions
                </li>
                <li>Personalize your assistant with custom automations</li>
              </ul>
            </CardBody>
          </Card>
          <Card className="p-4">
            <CardBody>
              <span className="flex item-center gap-2 mb-4">
                <LucidePhoneCall />
                <h3 className="text-2xl font-semibold "> Call & Command</h3>
              </span>

              <ul className="list-disc list-inside space-y-2">
                <li>Manage blockchain tasks</li>
                <li>Start & stop AI agents</li>
                <li>Get financial insights</li>
                <li>Execute actions in real time</li>
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Who is this for */}
      <div className="mt-16">
        <h2 className="text-4xl font-bold mb-8 text-center">
          Who Is This For?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-4">
            <CardBody>
              <h3 className="text-xl font-semibold mb-4">
                ✅ Crypto Enthusiasts
              </h3>
              <p>Manage your blockchain transactions hands-free</p>
            </CardBody>
          </Card>
          <Card className="p-4">
            <CardBody>
              <h3 className="text-xl font-semibold mb-4">✅ Senior Citizens</h3>
              <p>Simplified AI for effortless interactions</p>
            </CardBody>
          </Card>
          <Card className="p-4">
            <CardBody>
              <h3 className="text-xl font-semibold mb-4">
                ✅ Students & Entrepreneurs
              </h3>
              <p>Quick financial insights & automation</p>
            </CardBody>
          </Card>
          <Card className="p-4">
            <CardBody>
              <h3 className="text-xl font-semibold mb-4">
                ✅ Rural Farmers & Business Owners
              </h3>
              <p>Get blockchain access without internet hassles</p>
            </CardBody>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-4 h-screen">
        <section className="flex flex-col items-center justify-center">
          <Image
            alt="AI Phone Assistant"
            className="w-full rounded-lg object-cover"
            height={400}
            src="https://cdn.dribbble.com/userupload/17524831/file/original-056cb479253bdd985448ac8dcff70dab.jpg?resize=1024x768&vertical=center"
            width={680}
          />
          <p>Even Your Granny can use it.</p>
        </section>
        {/* AI That Listens Section */}
        <div className="mt-16 text-center">
          <h2 className="text-4xl font-bold mb-4">
            📞 AI That Listens & Executes
          </h2>
          <p className="text-xl mb-8">
            No apps. No typing. Just talk to your assistant and get things done
            in seconds.
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-16 text-center">
        <h2 className="text-4xl font-bold mb-4">⚡ Get Started Today!</h2>
        <p className="text-xl mb-8">
          Set up your AI phone agent in minutes and make your first call
        </p>
        <div className="flex justify-center gap-4">
          <Button
            as={Link}
            href="/signup"
            color="primary"
            size="lg"
            className="font-semibold"
          >
            Create Your AI Assistant Now
          </Button>
          <Button
            as={Link}
            href="/learn-more"
            variant="bordered"
            size="lg"
            className="font-semibold"
          >
            Learn More
          </Button>
        </div>
      </div>
    </DefaultLayout>
  );
}
