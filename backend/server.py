from controllers.filmeController import FilmeController
from flask import Flask, jsonify

app = Flask(__name__)
controller = FilmeController()
base_url = '/api'

# Busca todos os filmes
@app.route(f'{base_url}/filmes', methods=['GET'])
def todos_filmes():
    filmes = controller.listar_todos_filmes()
    if (filmes == None):
        return jsonify({ 'registro': [], 'total': 0 })
    
    return jsonify({
        'registros': filmes,
        'total': len(filmes),
    })

# Busca um filme pelo id
@app.route(f'{base_url}/filmes/<id>', methods=['GET'])
def filme_por_id(id):
    filme = controller.get_filme_por_id(id)
    if (filme == None):
        return jsonify({ 'registro': {}, 'total': 0 })
    
    return jsonify({
        'registro': filme,
        'total': 1,
    })

# Busca os produtores com maior intervalo entre dois prêmios consecutivos, e o que obteve dois prêmios mais rápido
@app.route(f'{base_url}/max-min-produtos-premiados', methods=['GET'])
def max_min_intervalo_premiados():
    resultado = controller.max_min_distancia_premios()
    if (resultado == None):
        return jsonify({ 'registro': {}, 'total': 0 })
    
    return jsonify(resultado)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
