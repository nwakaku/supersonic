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
  async getBalance(): Promise<any> {
    return await this.performAction("sonic", "get-balance");
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
      console.log("Sending payload:", data); // Log the payload
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok)
        throw new Error(`Error ${response.status}: ${response.statusText}`);
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
  .getBalance()
  .then((response) => {
    console.log("Balance:", response.result);
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
  .listTwitterActions()
  .then((response) => {
    console.log("Twitter Actions:", response.actions);
  })
  .catch((error) => {
    console.error("Error listing Twitter actions:", error);
  });

// // Example usage of chatWithAgent
// client.chatWithAgent("What is the capital of France?")
//   .then((response) => {
//     console.log("Agent Response:", response.response);
//   })
//   .catch((error) => {
//     console.error("Error chatting with agent:", error);
//   });

const SimpleChatPanel = () => {
  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [selectedAction, setSelectedAction] = useState("chat");
  const [additionalParams, setAdditionalParams] = useState<
    Record<string, string>
  >({});

  const client = new ZerePyFrontendClient("http://localhost:8000");

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      let response;

      setResponses((prev) => [
        ...prev,
        `Action: ${selectedAction}`,
        `Sent: ${message}`,
        `Received: ${JSON.stringify(response)}`,
      ]);
      setMessage("");
      setError("");
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to perform action");
    }
  };

  const renderAdditionalInputs = () => {
    switch (selectedAction) {
      case "send-sol":
      case "send-eth":
        return (
          <input
            type="text"
            value={additionalParams.recipient || ""}
            onChange={(e) =>
              setAdditionalParams({
                ...additionalParams,
                recipient: e.target.value,
              })
            }
            className="p-2 border rounded"
            placeholder="Recipient Address"
          />
        );
      case "swap-tokens":
        return (
          <>
            <input
              type="text"
              value={additionalParams.tokenA || ""}
              onChange={(e) =>
                setAdditionalParams({
                  ...additionalParams,
                  tokenA: e.target.value,
                })
              }
              className="p-2 border rounded"
              placeholder="Token A"
            />
            <input
              type="text"
              value={additionalParams.tokenB || ""}
              onChange={(e) =>
                setAdditionalParams({
                  ...additionalParams,
                  tokenB: e.target.value,
                })
              }
              className="p-2 border rounded"
              placeholder="Token B"
            />
          </>
        );
      case "generate-text":
        return (
          <input
            type="text"
            value={additionalParams.systemMessage || ""}
            onChange={(e) =>
              setAdditionalParams({
                ...additionalParams,
                systemMessage: e.target.value,
              })
            }
            className="p-2 border rounded"
            placeholder="System Message"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="mb-4 p-4 bg-gray-100 min-h-[300px] rounded">
        {responses.map((msg, i) => (
          <div key={i} className="mb-2">
            {msg}
          </div>
        ))}
        {error && <div className="text-red-500">{error}</div>}
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 p-2 border rounded"
          placeholder="Type a message or action parameters..."
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded">
          Send
        </button>
      </div>

      {renderAdditionalInputs()}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={async () => {
            const connections = await client.listConnections();
            setResponses((prev) => [
              ...prev,
              `Available Connections: ${JSON.stringify(connections)}`,
            ]);
          }}
          className="px-4 py-2 bg-green-500 text-white rounded">
          List Connections
        </button>
      </div>
    </div>
  );
};

export default SimpleChatPanel;
