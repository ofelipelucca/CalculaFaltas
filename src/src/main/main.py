import threading
import asyncio
from src.Logger.Logger import Logger
from src.DataWebSocketServer.DataWebSocketServer import DataWebSocketServer

class MainLoop:
    def __init__(self, port) -> None:
        self.logger = Logger.configure_application_logger()

        self.data_server = DataWebSocketServer(port=port)
        self.data_server_thread = None
        self.data_server_loop = None

        self.stop_flag = threading.Event()  

    def start_server(self, server: DataWebSocketServer, server_loop_var_name: str):
        """
        Método para iniciar um servidor WebSocket em uma thread separada.
        O server_loop_var_name é o nome da variável do loop que será atualizada.
        """
        loop = asyncio.new_event_loop()
        setattr(self, server_loop_var_name, loop)  
        asyncio.set_event_loop(loop)

        try:
            self.logger.info(f"{server.__class__.__name__} iniciando na porta {server.port}...")
            loop.run_until_complete(server.start())  

            while not self.stop_flag.is_set():
                loop.run_forever()  
        except Exception as e:
            error_message = f"Erro no servidor WebSocket ({server.__class__.__name__}): {e}"
            self.logger.error(error_message)
            raise RuntimeError(error_message)
        finally:
            loop.close()

    def start(self) -> None:
        """
        Inicia os servidores WebSocket em threads separadas.
        """
        try:
            self.data_server_thread = threading.Thread(target=self.start_server, 
                                                       args=(self.data_server, "data_server_loop"))
            self.data_server_thread.start()

        except Exception as e:
            error_message = f"Erro durante a execução dos servidores WebSocket: {e}"
            self.logger.error(error_message)
            raise RuntimeError(error_message)

    def stop(self) -> None:
        """
        Para os servidores WebSocket e espera que as threads sejam encerradas.
        """
        self.logger.info("Parando o MainLoop e servidores...")

        self.stop_flag.set()

        self.logger.info("Esperando servidores pararem...")
        
        if self.data_server_thread:
            self.logger.info("Esperando servidor de data...")
            self.data_server_thread.join()
        self.logger.info("MainLoop e servidores parados.")

    def __del__(self):
        """Método chamado ao destruir a instância da classe."""
        self.stop()