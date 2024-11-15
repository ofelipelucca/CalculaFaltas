from src.Calculadora.Calculadora import Calculadora
from src.Logger.Logger import Logger
import websockets
import asyncio
import json

app_logger = Logger.configure_application_logger()
error_logger = Logger.configure_error_logger()

class DataWebSocketServer:
    def __init__(self, port):
        self.port = port
        self.calculadora = Calculadora()
        
    async def handle_message(self, websocket, message):
        if isinstance(message, dict):
            if "ping" in message:
                await self.send_data(websocket, {"pong": True})
                return

            if "calcular" in message:
                carga = message.get("carga_horaria", 60)
                faltas = message.get("dias_falta", 60)
                
                msg = self.calculadora.calcula(carga, faltas)
            
                await self.send_data(websocket, {"status": "success", "message": msg})
                return
            
    async def send_data(self, websocket, data):
        json_data = json.dumps(data)
        await websocket.send(json_data)

    async def handler(self, websocket, path):
        async for message in websocket:
            try:
                message = json.loads(message)
                await self.handle_message(websocket, message)
            except json.JSONDecodeError:
                await websocket.send(json.dumps({"error": "JSON invalido."}))

    async def start(self):
        async with websockets.serve(self.handler, "localhost", self.port):
            app_logger.info(f"Servidor DataWebsocket aberto com sucesso na porta: {self.port}")
            await asyncio.Future()  
        error_logger.error(f"Erro ao abrir o servidor local na porta: {self.port}")