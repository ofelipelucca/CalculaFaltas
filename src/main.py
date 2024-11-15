from src.Logger.Logger import Logger
from src.main.main import MainLoop
import ctypes
import asyncio
import argparse

logger = Logger.configure_application_logger()
error_logger = Logger.configure_error_logger()

async def main() -> None:
    parser = argparse.ArgumentParser(description="Iniciar CalculaFaltas.")
    parser.add_argument("port", type=int, help="Porta para o servidor WebSocket.")
    args = parser.parse_args()

    port = args.port
    logger.info(f"Iniciando CalculaFaltas na porta {port}...")

    app_id = 'felipelucca.calcula.faltas.1.0'
    ctypes.windll.shell32.SetCurrentProcessExplicitAppUserModelID(app_id)

    try:
        main_loop = MainLoop(port)
        main_loop.start()
    except Exception as e:
        error_message = f"CalculaFaltas: {e}"
        logger.error(error_message)
        error_logger.error(error_message)
    finally:
        main_loop.stop()
        logger.info("CalculaFaltas encerrado.")

if __name__ == "__main__":
    asyncio.run(main())
