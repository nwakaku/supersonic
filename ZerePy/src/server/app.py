from fastapi import FastAPI, HTTPException, BackgroundTasks, Request
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import logging
import asyncio
import signal
import threading
from pathlib import Path
from src.cli import ZerePyCLI
from fastapi.middleware.cors import CORSMiddleware
from src.connections.goat_connection import GoatConnection
import requests 

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("server/app")

class ActionRequest(BaseModel):
    connection: str
    action: str
    params: Optional[Dict[str, Any]] = {}

class ConnectionRequest(BaseModel):
    """Request model for proxy list actions"""
    connectionId: str

class ConfigureRequest(BaseModel):
    """Request model for configuring connections"""
    connection: str
    params: Optional[Dict[str, Any]] = {}

class ServerState:
    """Simple state management for the server"""
    def __init__(self):
        self.cli = ZerePyCLI()
        self.agent_running = False
        self.agent_task = None
        self._stop_event = threading.Event()

    def _run_agent_loop(self):
        """Run agent loop in a separate thread"""
        try:
            log_once = False
            while not self._stop_event.is_set():
                if self.cli.agent:
                    try:
                        if not log_once:
                            logger.info("Loop logic not implemented")
                            log_once = True

                    except Exception as e:
                        logger.error(f"Error in agent action: {e}")
                        if self._stop_event.wait(timeout=30):
                            break
        except Exception as e:
            logger.error(f"Error in agent loop thread: {e}")
        finally:
            self.agent_running = False
            logger.info("Agent loop stopped")

    async def start_agent_loop(self):
        """Start the agent loop in background thread"""
        if not self.cli.agent:
            raise ValueError("No agent loaded")
        
        if self.agent_running:
            raise ValueError("Agent already running")

        self.agent_running = True
        self._stop_event.clear()
        self.agent_task = threading.Thread(target=self._run_agent_loop)
        self.agent_task.start()

    async def stop_agent_loop(self):
        """Stop the agent loop"""
        if self.agent_running:
            self._stop_event.set()
            if self.agent_task:
                self.agent_task.join(timeout=5)
            self.agent_running = False

    def get_goat_connection(self) -> Optional[GoatConnection]:
        """Helper method to get GOAT connection from current agent"""
        if not self.cli.agent:
            return None
        return self.cli.agent.connection_manager.connections.get('goat')


class ZerePyServer:
    def __init__(self):
        self.app = FastAPI(title="ZerePy Server")

         # Add CORS middleware properly within the class initialization
        self.app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Allow all origins for testing
        allow_credentials=True,
        allow_methods=["*"],  # Allow all methods
        allow_headers=["*"],  # Allow all headers
    )
        
         # Middleware to inject the ngrok-skip-browser-warning header
        @self.app.middleware("http")
        async def inject_ngrok_header(request: Request, call_next):
            response = await call_next(request)
            # Add the ngrok-skip-browser-warning header to the response
            response.headers["ngrok-skip-browser-warning"] = "true"
            return response
        

        self.state = ServerState()
        self.setup_routes()

    def setup_routes(self):
        @self.app.get("/")
        async def root():
            """Server status endpoint"""
            return {
                "status": "running",
                "agent": self.state.cli.agent.name if self.state.cli.agent else None,
                "agent_running": self.state.agent_running
            }

        @self.app.get("/agents")
        async def list_agents():
            """List available agents"""
            try:
                agents = []
                agents_dir = Path("agents")
                if agents_dir.exists():
                    for agent_file in agents_dir.glob("*.json"):
                        if agent_file.stem != "general":
                            agents.append(agent_file.stem)
                return {"agents": agents}
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))


        @self.app.post("/retell/load-agent")
        async def load_agent(request: Request):
            try:
                    
                # Get the post data and extract args
                post_data = await request.json()
                args = post_data.get("args", {})
                agent_name = args.get("name")
                
                if not agent_name:
                    logger.error("No agent name provided in args")
                    return {"message": "error", "detail": "No agent name provided"}
                    
                # Log the incoming request
                logger.info(f"Loading agent with name: {agent_name}")
                
                # Load the agent
                self.state.cli._load_agent_from_file(agent_name)
                
                # Return success response
                return {
                    "message": "success",
                    "agent": agent_name
                }
                    
            except Exception as e:
                logger.error(f"Failed to load agent: {str(e)}", exc_info=True)
                return {"message": "error", "detail": str(e)}
    


        @self.app.get("/connections")
        async def list_connections():
            """List all available connections"""
            # if not self.state.cli.agent:
            #     raise HTTPException(status_code=400, detail="No agent loaded")
            
            try:
                connections = {}
                for name, conn in self.state.cli.agent.connection_manager.connections.items():
                    connections[name] = {
                        "configured": conn.is_configured(),
                        "is_llm_provider": conn.is_llm_provider
                    }
                return {"connections": connections}
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))

        @self.app.post("/retell/agent-action")
        async def agent_action(request: Request):
            try:
                # Log the incoming request
                logger.info("Incoming request to /retell/agent-action")
                
                # Get the post data and extract args
                post_data = await request.json()
                args = post_data.get("args", {})
                
                # Extract required parameters from args
                connection_name = args.get("connection")
                action_name = args.get("action")
                action_params = args.get("params", {})
                
                # Validate required parameters
                if not connection_name or not action_name:
                    logger.error("Missing required parameters: connection or action")
                    return {"message": "error", "detail": "Missing required parameters: connection or action"}
                
                # Log the extracted parameters
                logger.info(f"Processing action request: connection={connection_name}, action={action_name}, params={action_params}")
                
                # Validate agent is loaded
                if not self.state.cli.agent:
                    logger.error("No agent loaded")
                    return {"message": "error", "detail": "No agent loaded"}
                
                # Get the connection
                connection = self.state.cli.agent.connection_manager.connections.get(connection_name)
                if not connection:
                    logger.error(f"Connection {connection_name} not found")
                    return {"message": "error", "detail": f"Connection {connection_name} not found"}
                
                # Run the action in a thread pool
                result = await asyncio.to_thread(
                    connection.perform_action,
                    action_name,
                    **action_params
                )
                
                # Validate result
                if result is None:
                    logger.error("Action returned None")
                    return {"message": "error", "detail": "Action returned None"}
                
                # Log the successful action execution
                logger.info(f"Action executed successfully: connection={connection_name}, action={action_name}")
                
                # Convert result to string and return
                return {
                    "message": "success",
                    "result": str(result)
                }
                    
            except Exception as e:
                logger.error(f"Action failed: {str(e)}", exc_info=True)
                return {"message": "error", "detail": str(e)}


        @self.app.post("/agent/chat")
        async def agent_chat(chat_request: Dict[str, Any]):
            """Handle chat requests"""
            try:
                if not self.state.cli.agent:
                    raise HTTPException(status_code=400, detail="No agent loaded")

                # Ensure the LLM provider is set up
                if not self.state.cli.agent.is_llm_set:
                    self.state.cli.agent._setup_llm_provider()

                # Get the user's message
                user_message = chat_request.get("message")
                if not user_message:
                    raise HTTPException(status_code=400, detail="Message is required")

                # Get the agent's response
                response = self.state.cli.agent.prompt_llm(user_message)
                return {"status": "success", "response": response}
            except Exception as e:
                logger.error(f"Chat failed: {str(e)}")
                raise HTTPException(status_code=500, detail=str(e))

        # @self.app.post("/agent/start")
        # async def start_agent():
        #     """Start the agent loop"""
        #     # if not self.state.cli.agent:
        #     #     raise HTTPException(status_code=400, detail="No agent loaded")
            
        #     try:
        #         await self.state.start_agent_loop()
        #         return {"status": "success", "message": "Agent loop started"}
        #     except Exception as e:
        #         raise HTTPException(status_code=400, detail=str(e))

        @self.app.post("/agent/start")
        async def start_agent(request: Request):
            """Start the agent loop"""
            try:
                # Log the incoming request
                logger.info("Incoming request to /agent/start")
                
                # Validate agent is loaded
                if not self.state.cli.agent:
                    logger.error("No agent loaded")
                    return {"message": "error", "detail": "No agent loaded"}
                
                # Start the agent loop
                await self.state.start_agent_loop()
                
                # Log successful start
                logger.info("Agent loop started successfully")
                
                return {
                    "message": "success",
                    "detail": "Agent loop started"
                }
                    
            except Exception as e:
                logger.error(f"Failed to start agent: {str(e)}", exc_info=True)
                return {"message": "error", "detail": str(e)}


        @self.app.post("/agent/stop")
        async def stop_agent(request: Request):
            """Stop the agent loop"""
            try:
                # Log the incoming request
                logger.info("Incoming request to /agent/stop")
                
                # Stop the agent loop
                await self.state.stop_agent_loop()
                
                # Log successful stop
                logger.info("Agent loop stopped successfully")
                
                return {
                    "message": "success",
                    "detail": "Agent loop stopped"
                }
                    
            except Exception as e:
                logger.error(f"Failed to stop agent: {str(e)}", exc_info=True)
                return {"message": "error", "detail": str(e)}

        @self.app.post("/connections/{name}/configure")
        async def configure_connection(name: str, config: ConfigureRequest):
            """Configure a specific connection"""
            # if not self.state.cli.agent:
            #     raise HTTPException(status_code=400, detail="No agent loaded")
            
            try:
                connection = self.state.cli.agent.connection_manager.connections.get(name)
                if not connection:
                    raise HTTPException(status_code=404, detail=f"Connection {name} not found")
                
                success = connection.configure(**config.params)
                if success:
                    return {"status": "success", "message": f"Connection {name} configured successfully"}
                else:
                    raise HTTPException(status_code=400, detail=f"Failed to configure {name}")
                    
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))
            
        @self.app.get("/connections/{name}/actions")
        async def list_connection_actions(name: str):
            """List actions for a specific connection"""
            try:
                # Log the incoming request
                logger.info(f"Incoming request to list actions for connection: {name}")
                
                # Validate agent is loaded
                if not self.state.cli.agent:
                    logger.error("No agent loaded")
                    raise HTTPException(status_code=400, detail="No agent loaded")

                # Get the connection
                connection = self.state.cli.agent.connection_manager.connections.get(name)
                if not connection:
                    logger.error(f"Connection {name} not found")
                    raise HTTPException(status_code=404, detail=f"Connection {name} not found")

                # For GOAT connection, ensure it's configured before listing actions
                if name == 'goat':
                    if not connection.is_configured(verbose=True):
                        logger.error("GOAT connection not configured")
                        raise HTTPException(
                            status_code=400, 
                            detail="GOAT connection not configured. Please configure it first."
                        )

                # List actions for the connection
                actions = connection.list_actions()
                
                # Log successful action listing
                logger.info(f"Successfully listed actions for connection: {name}")
                
                return {"status": "success", "actions": actions}
            
            except HTTPException as e:
                # Re-raise HTTPException to return the appropriate response
                raise e
            except Exception as e:
                # Log the error and return a 500 response
                logger.error(f"Error listing actions for connection {name}: {str(e)}", exc_info=True)
                raise HTTPException(status_code=500, detail=str(e))

        @self.app.post("/proxy/connections/actions")
        async def proxy_list_actions(request: Request):
            """Proxy to allow Retell AI (POST) to internally perform a GET request"""
            try:
                # Log the incoming request
                logger.info("Incoming request to /proxy/connections/actions")
                
                # Get the post data and extract args
                post_data = await request.json()
                args = post_data.get("args", {})
                
                # Extract the connection name from args
                connection_name = args.get("connectionId")
                
                # Validate required parameters
                if not connection_name:
                    logger.error("Missing required parameter: connectionId")
                    return {"message": "error", "detail": "Missing required parameter: connectionId"}
                
                # Log the extracted parameters
                logger.info(f"Processing proxy request: connection={connection_name}")
                
                # Validate agent is loaded
                if not self.state.cli.agent:
                    logger.error("No agent loaded")
                    return {"message": "error", "detail": "No agent loaded"}

                # Get the connection
                connection = self.state.cli.agent.connection_manager.connections.get(connection_name)
                if not connection:
                    logger.error(f"Connection {connection_name} not found")
                    return {"message": "error", "detail": f"Connection {connection_name} not found"}

                # For GOAT connection, ensure it's configured before listing actions
                if connection_name == 'goat':
                    if not connection.is_configured(verbose=True):
                        logger.error("GOAT connection not configured")
                        return {
                            "message": "error",
                            "detail": "GOAT connection not configured. Please configure it first."
                        }

                # List actions for the connection
                actions = connection.list_actions()
                
                # Log successful action listing
                logger.info(f"Successfully listed actions for connection: {connection_name}")
                
                return {
                    "message": "success",
                    "actions": actions
                }
            
            except Exception as e:
                # Log the error and return a 500 response
                logger.error(f"Error listing actions for connection: {str(e)}", exc_info=True)
                return {"message": "error", "detail": str(e)}

        @self.app.get("/connections/{name}/status")
        async def connection_status(name: str):
            """Get configuration status of a connection"""
            # if not self.state.cli.agent:
            #     raise HTTPException(status_code=400, detail="No agent loaded")
                
            try:
                connection = self.state.cli.agent.connection_manager.connections.get(name)
                if not connection:
                    raise HTTPException(status_code=404, detail=f"Connection {name} not found")
                    
                return {
                    "name": name,
                    "configured": connection.is_configured(verbose=True),
                    "is_llm_provider": connection.is_llm_provider
                }
                
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))

def create_app():
    server = ZerePyServer()
    return server.app