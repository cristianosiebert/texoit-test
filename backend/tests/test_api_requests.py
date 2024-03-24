import unittest
import requests

class TestIntegration(unittest.TestCase):
    BASE_URL = 'http://localhost:5000/api'  # Altere o URL conforme necessário

    def test_todos_filmes(self):
        response = requests.get(f'{self.BASE_URL}/filmes')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        expected_length = 206
        # Testando se está retornando todos os filmes corretamente
        self.assertEqual(len(data['registros']), expected_length)

    def test_filme_por_id(self):
        response = requests.get(f'{self.BASE_URL}/filmes/1')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        movie_name_1 = "Can't Stop the Music"
        # Verificando se o nome do filme está correto
        self.assertEqual(data['registro']['title'], movie_name_1)

        response = requests.get(f'{self.BASE_URL}/filmes/5')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        movie_name_2 = "The Nude Bomb"
        # Verificando se o nome do filme está correto
        self.assertEqual(data['registro']['title'], movie_name_2)

    def test_max_min_produtores_premiados(self):
        response = requests.get(f'{self.BASE_URL}/max-min-produtos-premiados')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        # Verificando se os dados dos produtores premiados estão corretos
        self.assertEqual(data['max'][0]['interval'], 9)
        self.assertEqual(data['min'][0]['interval'], 1)

if __name__ == '__main__':
    unittest.main()
