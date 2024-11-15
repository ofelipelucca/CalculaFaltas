from src.Logger.Logger import Logger

app_logger = Logger.configure_application_logger()
error_logger = Logger.configure_error_logger()

class Calculadora:
    def __init__(self) -> None:
        self.__carga_horaria = 0
        self.__horas_faltadas = 0

    def esta_reprovado(self) -> bool:
        """
        Verifica se o aluno está reprovado.

        Considera reprovado se as faltas representarem uma porcentagem maior que 25% da carga horária.

        Retorna True se o aluno estiver reprovado, False caso contrário.
        """
        if self.__horas_faltadas == 0:
            return False  
        
        porcentagem_faltas = self.__horas_faltadas / self.__carga_horaria
        return porcentagem_faltas >= 0.25

    def calcula_faltas_restantes(self) -> int:
        """
        Calcula quantas aulas o aluno ainda pode faltar sem ser reprovado.
        """
        limite_faltas = self.__carga_horaria * 0.25
        return int(max(0, int(limite_faltas - self.__horas_faltadas)) / 2)

    def calcula(self, carga_horaria: int, dias_faltados: int) -> tuple:
        """
        Define a carga horária e o total de horas faltadas, verifica a reprovação e exibe quantas horas ainda pode faltar.
        
        Considera 1 aula = 2 horas
        
        Returns: 
            tuple: (bool, str) -> (True se reprovado, mensagem explicativa)
        """
        self.__carga_horaria = carga_horaria
        self.__horas_faltadas = dias_faltados * 2

        if self.esta_reprovado():
            mensagem = "Você está reprovado por falta."
            app_logger.info(mensagem)
            return (True, mensagem)
        faltas_restantes = self.calcula_faltas_restantes()
        if faltas_restantes == 0:
            mensagem = "Se faltar mais uma vez, estará reprovado."
            return (True, mensagem)
        mensagem = f"Você ainda pode faltar {faltas_restantes} aulas sem ser reprovado."
        app_logger.info(mensagem)
        return (False, mensagem)