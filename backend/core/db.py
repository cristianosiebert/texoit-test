from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.filme import Base, Filme
import csv

def criar_conexao():
    engine = create_engine('sqlite:///:memory:', echo=True)
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    return Session()

def carregar_dados(session):
    with open('core/movielist.csv', 'r', encoding='utf-8') as csvfile:
        csv_reader = csv.DictReader(csvfile, delimiter=';')
        for row in csv_reader:
            filme = Filme(
                year=int(row['year']),
                title=row['title'],
                studios=row['studios'],
                producers=row['producers'],
                winner=row['winner']
            )
            session.add(filme)
    session.commit()

def get_session():
    session = criar_conexao()
    carregar_dados(session)
    return session