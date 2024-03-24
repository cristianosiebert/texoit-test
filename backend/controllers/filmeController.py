from services.filmeService import FilmeService

class FilmeController:
    def __init__(self):
        self.service = FilmeService()

    def listar_todos_filmes(self):
        resultado = self.service.busca_filmes()
        return resultado

    def get_filme_por_id(self, id):
        resultado = self.service.buscar_filme(id)
        return resultado

    def max_min_distancia_premios(self):
        resultado = self.service.max_min_premios()
        return resultado