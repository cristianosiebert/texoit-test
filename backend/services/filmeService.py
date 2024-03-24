from sqlalchemy import func
from core.db import get_session
from models.filme import Filme
from collections import defaultdict

class FilmeService:
    '''
        Método para buscar todos os filmes do banco.
    '''
    def busca_filmes(self):
        session = get_session()
        filmes = session.query(Filme).all()
        filmes_serializados = [filme.to_dict() for filme in filmes]
        session.close()
        return filmes_serializados

    '''
        Método para buscar um filme pelo ID
    '''
    def buscar_filme(self, id):
        session = get_session()
        filme = session.query(Filme).filter(Filme.id == id).first()
        if (filme == None) : return filme
        filme_serializado = filme.to_dict()
        session.close()
        return filme_serializado
    
    '''
        Método para encontrar o índice de um objeto baseado em um atributo do mesmo
    '''
    def get_index(self, value, attr, array):
        result = None
        for i, obj in enumerate(array):
            if value == obj[attr]:
                result = i
                break
        return result

    '''
        Método que retorna o produtor com maior intervalo entre dois prêmios consecutivos, e o que
        obteve dois prêmios mais rápido.
    '''
    def max_min_premios(self):
        session = get_session()

        # Pegando apenas os filmes vencedores
        filmes = session.query(Filme).filter(Filme.winner == 'yes').all()
        produtores = [];

        for filme in filmes:
            # Separando os produtores por nome
            produtores_array = filme.producers.replace(' and ', ',').split(',')
            for produtor in produtores_array:
                # Se o array de produtores está vazio, insere direto
                if len(produtores) > 0:
                    # Senão, tenta encontrar o produtor no array de produtores
                    index = self.get_index(produtor, "producer", produtores)
                    if index is not None:
                        # Caso encontre, ele verifica se precisa atualizar os anos de vitória e calcular o novo intervalo
                        if filme.year > produtores[index]["followingWin"]:
                            produtores[index]["followingWin"] = filme.year
                        if filme.year < produtores[index]["previousWin"]:
                            produtores[index]["previousWin"] = filme.year
                        newInterval = produtores[index]["followingWin"] - produtores[index]["previousWin"]
                        produtores[index]["interval"] = newInterval
                    else:
                        # Se não encontrar, cadastra o primeiro registro
                        produtores.append({
                            "producer": produtor,
                            "interval": 0,
                            "previousWin": filme.year,
                            "followingWin": filme.year
                        });
                else:
                    produtores.append({
                        "producer": produtor,
                        "interval": 0,
                        "previousWin": filme.year,
                        "followingWin": filme.year
                    });
        
        # Após gerar o array de produtores, removemos todos que possuem apenas um prêmio, e não entram na contagem do resultado.
        produtores_filtrados = [produtor for produtor in produtores if produtor["interval"] != 0]

        # A partir daí é separado os maiores e menores intervalos, caso tenham objetos com o mesmo intervalo
        intervalos = [produtor["interval"] for produtor in produtores_filtrados]
        min_intervalo = min(intervalos)
        max_intervalo = max(intervalos)
        produtores_min_intervalo = [produtor for produtor in produtores_filtrados if produtor["interval"] == min_intervalo]
        produtores_max_intervalo = [produtor for produtor in produtores_filtrados if produtor["interval"] == max_intervalo]

        # O array é formatado e retornado para o controller
        resultado = {"min": produtores_min_intervalo, "max": produtores_max_intervalo}
        session.close()
        return resultado
        