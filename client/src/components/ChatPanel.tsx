/* eslint-disable no-console */
//@ts-nocheck
import { useState } from "react";

class ZerePyFrontendClient {
  private baseUrl: string;

  /**
   * Constructor to initialize the base URL for API requests.
   * @param baseUrl - The base URL of the backend API.
   */
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // ==================== Agent Management ====================

  /**
   * Load an agent by its name.
   * @param name - The name of the agent to load.
   * @returns A promise resolving to the response from the server.
   */
  async loadAgent(name: string): Promise<any> {
    return await this._postData(`/agents/${name}/load`);
  }

  // ==================== Connection Management ====================

  /**
   * List all available connections.
   * @returns A promise resolving to the list of connections.
   */
  async listConnections(): Promise<any> {
    return await this._fetchData("/connections");
  }

  /**
   * List actions for a specific connection.
   * @param connectionId - The ID of the connection.
   * @returns A promise resolving to the list of actions for the connection.
   */
  async listActions(connectionId: string): Promise<any> {
    return await this._fetchData(`/connections/${connectionId}/actions`);
  }

  async listGoatActions(): Promise<any> {
    return await this.listActions("goat");
  }

  async listSonicActions(): Promise<any> {
    return await this.listActions("sonic");
  }

  async listTwitterActions(): Promise<any> {
    return await this.listActions("twitter");
  }

  // ==================== Sonic Connection Actions ====================

  /**
   * Get the token address by its ticker symbol.
   * @param ticker - The ticker symbol of the token.
   * @returns A promise resolving to the token address.
   */
  async getTokenByTicker(ticker: string): Promise<any> {
    return await this.performAction("sonic", "get-token-by-ticker", { ticker });
  }

  /**
   * Get the balance of $S or a specific token.
   * @returns A promise resolving to the balance information.
   */
  async getBalance(address: string): Promise<any> {
    const actions = await this.listGoatActions();
    const balanceAction = actions?.actions?.find(
      (a: any) => a.name === "get_balance"
    );

    // Log the expected parameters
    console.log("Expected parameters:", balanceAction?.parameters);

    return await this.performAction("goat", "get_balance", {
      // Use the correct parameter name from the action definition
      [balanceAction?.parameters[0].name]: address,
    });
  }

  async getSonicBalance(): Promise<any> {
    return await this.performAction("sonic", "get_balance");
  }

  async getAddress(): Promise<any> {
    return await this.performAction("goat", "get_address");
  }

  async getChain(): Promise<any> {
    return await this.performAction("goat", "get_chain");
  }

  /**
   * Transfer $S or tokens to another address.
   * @param toAddress - The recipient's address.
   * @param amount - The amount to transfer.
   * @param tokenAddress - (Optional) The address of the token to transfer.
   * @returns A promise resolving to the transfer result.
   */
  async transfer(
    toAddress: string,
    amount: string,
    tokenAddress?: string
  ): Promise<any> {
    const params: Record<string, any> = { to_address: toAddress, amount };

    if (tokenAddress) params.token_address = tokenAddress;

    return await this.performAction("sonic", "transfer", params);
  }

  /**
   * Swap tokens.
   * @param tokenIn - The address of the input token.
   * @param tokenOut - The address of the output token.
   * @param amount - The amount to swap.
   * @param slippage - (Optional) The maximum slippage percentage.
   * @returns A promise resolving to the swap result.
   */
  async swap(
    tokenIn: string,
    tokenOut: string,
    amount: string,
    slippage?: number
  ): Promise<any> {
    const params: Record<string, any> = {
      token_in: tokenIn,
      token_out: tokenOut,
      amount,
    };

    if (slippage) params.slippage = slippage;

    return await this.performAction("sonic", "swap", params);
  }

  // ==================== Chat Feature ====================

  /**
   * Send a message to the agent and get a response.
   * @param message - The message to send to the agent.
   * @returns A promise resolving to the agent's response.
   */
  async chatWithAgent(message: string): Promise<any> {
    return await this._postData("/agent/chat", { message });
  }

  // ==================== Agent Actions ====================

  /**
   * Perform an action with optional parameters.
   * @param connection - The connection to use for the action.
   * @param action - The action to perform.
   * @param params - (Optional) Additional parameters for the action.
   * @returns A promise resolving to the result of the action.
   */
  async performAction(
    connection: string,
    action: string,
    params: Record<string, any> = {}
  ): Promise<any> {
    return await this._postData(`/agent/action`, {
      connection,
      action,
      params,
    });
  }

  // ==================== Internal Methods ====================

  /**
   * Internal method to perform a GET request.
   * @param endpoint - The API endpoint to fetch data from.
   * @returns A promise resolving to the fetched data.
   */
  private async _fetchData(endpoint: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`);

      if (!response.ok)
        throw new Error(`Error ${response.status}: ${response.statusText}`);

      return await response.json();
    } catch (error) {
      console.error(`Fetch error at ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Internal method to perform a POST request.
   * @param endpoint - The API endpoint to send data to.
   * @param data - The data to send in the request body.
   * @returns A promise resolving to the response from the server.
   */
  private async _postData(
    endpoint: string,
    data: Record<string, any> = {}
  ): Promise<any> {
    try {
      console.log("Sending payload:", JSON.stringify(data, null, 2));
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Post error at ${endpoint}: ${errorText}`);
        throw new Error(errorText);
      }

      return await response.json();
    } catch (error) {
      console.error(`Post error at ${endpoint}:`, error);
      throw error;
    }
  }
}

// ==================== Example Usage ====================

const client = new ZerePyFrontendClient("http://localhost:8000");

// Load an agent
client.loadAgent("example").then((response) => {
  console.log("Agent Loaded:", response);
});

// Get balance
client
  .getBalance("0x1be9C7c5E544Bb78Be030b2A2B66661cF32E7290")
  .then((response) => {
    console.log("Balance:", response.result);
  })
  .catch((error) => {
    console.error("Error getting balance:", error);
  });

client
  .getSonicBalance()
  .then((response) => {
    console.log("Sonic Balance:", response.result);
  })
  .catch((error) => {
    console.error("Error getting balance:", error);
  });

client
  .getAddress()
  .then((response) => {
    console.log("Address:", response.result);
  })
  .catch((error) => {
    console.error("Error getting balance:", error);
  });

client
  .getChain()
  .then((response) => {
    console.log("Chain:", response.result);
  })
  .catch((error) => {
    console.error("Error getting chain:", error);
  });

client
  .getGoatBalance("0x1be9C7c5E544Bb78Be030b2A2B66661cF32E7290")
  .then((response) => {
    console.log("From Goat Balance:", response.result);
  })
  .catch((error) => {
    console.error("Error getting balance:", error);
  });

// Transfer tokens
client
  .transfer("0xRecipientAddress", "100", "0xTokenAddress")
  .then((response) => {
    console.log("Transfer Result:", response.result);
  })
  .catch((error) => {
    console.error("Error transferring tokens:", error);
  });

// Swap tokens
client
  .swap("0xTokenInAddress", "0xTokenOutAddress", "50", 1.0)
  .then((response) => {
    console.log("Swap Result:", response.result);
  })
  .catch((error) => {
    console.error("Error swapping tokens:", error);
  });

client
  .listSonicActions()
  .then((response) => {
    console.log("Sonic Actions:", response.actions);
  })
  .catch((error) => {
    console.error("Error listing Sonic actions:", error);
  });

client
  .listGoatActions()
  .then((response) => {
    console.log("Goat Actions:", response.actions);
  })
  .catch((error) => {
    console.error("Error listing Sonic actions:", error);
  });

client
  .listTwitterActions()
  .then((response) => {
    console.log("Twitter Actions:", response.actions);
  })
  .catch((error) => {
    console.error("Error listing Twitter actions:", error);
  });

// Example usage of chatWithAgent
client
  .chatWithAgent("What is the capital of France?")
  .then((response) => {
    console.log("Agent Response:", response.response);
  })
  .catch((error) => {
    console.error("Error chatting with agent:", error);
  });

const SimpleChatPanel = () => {
  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState<
    { type: "question" | "response"; content: string }[]
  >([]);
  const [error, setError] = useState("");

  const client = new ZerePyFrontendClient("http://localhost:8000");

  const interpretUserInput = (input: string) => {
    const lowerInput = input.toLowerCase();

    // Balance
    if (lowerInput.includes("balance")) {
      const addressMatch = lowerInput.match(/0x[a-fA-F0-9]{40}/);
      const address = addressMatch ? addressMatch[0] : "";

      return { action: "getBalance", params: { address } };
    }

    // Transfer
    if (lowerInput.includes("transfer")) {
      const amountMatch = lowerInput.match(/\d+/);
      const addressMatch = lowerInput.match(/0x[a-fA-F0-9]{40}/g);

      return {
        action: "transfer",
        params: {
          toAddress: addressMatch ? addressMatch[1] : "",
          amount: amountMatch ? amountMatch[0] : "",
          tokenAddress: "", // Optional
        },
      };
    }

    // Swap
    if (lowerInput.includes("swap")) {
      const amountMatch = lowerInput.match(/\d+/);
      const tokenMatches = lowerInput.match(/\b[A-Za-z]+\b/g);

      return {
        action: "swap",
        params: {
          tokenIn: tokenMatches ? tokenMatches[0] : "",
          tokenOut: tokenMatches ? tokenMatches[1] : "",
          amount: amountMatch ? amountMatch[0] : "",
          slippage: "", // Optional
        },
      };
    }

    // Get Address
    if (lowerInput.includes("address")) {
      return { action: "getAddress", params: {} };
    }

    // Get Chain
    if (lowerInput.includes("chain")) {
      return { action: "getChain", params: {} };
    }

    // List Sonic Actions
    if (lowerInput.includes("sonic actions")) {
      return { action: "listSonicActions", params: {} };
    }

    // List Goat Actions
    if (lowerInput.includes("goat actions")) {
      return { action: "listGoatActions", params: {} };
    }

    // List Twitter Actions
    if (lowerInput.includes("twitter actions")) {
      return { action: "listTwitterActions", params: {} };
    }

    // Load Agent
    if (lowerInput.includes("load agent")) {
      const agentNameMatch = lowerInput.match(/load agent (\w+)/);
      const agentName = agentNameMatch ? agentNameMatch[1] : "";

      return { action: "loadAgent", params: { name: agentName } };
    }

    // Get Token by Ticker
    if (lowerInput.includes("token by ticker")) {
      const tickerMatch = lowerInput.match(/token by ticker (\w+)/);
      const ticker = tickerMatch ? tickerMatch[1] : "";

      return { action: "getTokenByTicker", params: { ticker } };
    }

    // Default to chat if no action is recognized
    return { action: "chat", params: { message: input } };
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      // Add the user's question to the responses
      setResponses((prev) => [...prev, { type: "question", content: message }]);

      // Interpret the user's input
      const { action, params } = interpretUserInput(message);

      let response;

      switch (action) {
        case "getBalance":
          response = await client.getBalance(params.address);
          break;
        case "transfer":
          response = await client.transfer(
            params.toAddress,
            params.amount,
            params.tokenAddress,
          );
          break;
        case "swap":
          response = await client.swap(
            params.tokenIn,
            params.tokenOut,
            params.amount,
            params.slippage ? parseFloat(params.slippage) : undefined,
          );
          break;
        case "getAddress":
          response = await client.getAddress();
          break;
        case "getChain":
          response = await client.getChain();
          break;
        case "listSonicActions":
          response = await client.listSonicActions();
          break;
        case "listGoatActions":
          response = await client.listGoatActions();
          break;
        case "listTwitterActions":
          response = await client.listTwitterActions();
          break;
        case "loadAgent":
          response = await client.loadAgent(params.name);
          break;
        case "getTokenByTicker":
          response = await client.getTokenByTicker(params.ticker);
          break;
        case "chat":
        default:
          response = await client.chatWithAgent(message);
          break;
      }

      // Extract and display the relevant result
      const result = response.result || response.response || response;

      setResponses((prev) => [
        ...prev,
        { type: "response", content: JSON.stringify(result, null, 2) },
      ]);
      setMessage("");
      setError("");
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to perform action");
    }
  };

  return (
    <div className=" bg-gradient-to-br from-purple-50 to-blue-50 flex flex-col items-center justify-center p-2">
      <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4">
          <h1 className="text-2xl font-bold text-white">ZerePy Chat</h1>
          <p className="text-sm text-purple-200">Your AI-powered assistant</p>
        </div>

      </div>
    </div>
  );
};

export default SimpleChatPanel;
