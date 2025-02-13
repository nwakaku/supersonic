from fastapi import FastAPI, HTTPException, BackgroundTasks

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

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("server/app")

class ActionRequest(BaseModel):
    connection: str
    action: str
    params: Optional[Dict[str, Any]] = {}

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
            allow_origins=["http://localhost:5174"],  # Frontend URL
            allow_credentials=True,
            allow_methods=["*"],  # Allow all methods
            allow_headers=["*"],  # Allow all headers
        )
        

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

        @self.app.post("/agents/{name}/load")
        async def load_agent(name: str):
            """Load a specific agent"""
            try:
                self.state.cli._load_agent_from_file(name)
                return {
                    "status": "success",
                    "agent": name
                }
            except Exception as e:
                raise HTTPException(status_code=400, detail=str(e))

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

        @self.app.post("/agent/action")
        async def agent_action(action_request: ActionRequest):
            try:
                logger.info(f"Incoming request payload: {action_request.dict()}")
                
                if not self.state.cli.agent:
                    raise HTTPException(status_code=400, detail="No agent loaded")
                    
                connection = self.state.cli.agent.connection_manager.connections.get(action_request.connection)
                if not connection:
                    raise HTTPException(status_code=404, detail=f"Connection {action_request.connection} not found")
                    
                # Run the action in a thread pool since it's synchronous
                result = await asyncio.to_thread(
                    connection.perform_action,
                    action_request.action,
                    **action_request.params
                )
                
                if result is None:
                    raise HTTPException(status_code=500, detail="Action returned None")
                    
                return {"status": "success", "result": result}
                
            except Exception as e:
                logger.error(f"Action failed: {str(e)}", exc_info=True)
                raise HTTPException(status_code=500, detail=str(e))
            
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

        @self.app.post("/agent/start")
        async def start_agent():
            """Start the agent loop"""
            # if not self.state.cli.agent:
            #     raise HTTPException(status_code=400, detail="No agent loaded")
            
            try:
                await self.state.start_agent_loop()
                return {"status": "success", "message": "Agent loop started"}
            except Exception as e:
                raise HTTPException(status_code=400, detail=str(e))

        @self.app.post("/agent/stop")
        async def stop_agent():
            """Stop the agent loop"""
            try:
                await self.state.stop_agent_loop()
                return {"status": "success", "message": "Agent loop stopped"}
            except Exception as e:
                raise HTTPException(status_code=400, detail=str(e))
        
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
                if not self.state.cli.agent:
                    raise HTTPException(status_code=400, detail="No agent loaded")

                connection = self.state.cli.agent.connection_manager.connections.get(name)
                if not connection:
                    raise HTTPException(status_code=404, detail=f"Connection {name} not found")

                # For GOAT connection, ensure it's configured before listing actions
                if name == 'goat':
                    if not connection.is_configured(verbose=True):
                        raise HTTPException(
                            status_code=400, 
                            detail="GOAT connection not configured. Please configure it first."
                        )

                actions = connection.list_actions()
                return {"status": "success", "actions": actions}
            except HTTPException as e:
                raise e
            except Exception as e:
                logger.error(f"Error listing actions for connection {name}: {str(e)}")
                raise HTTPException(status_code=500, detail=str(e))
    


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