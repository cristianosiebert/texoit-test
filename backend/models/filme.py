from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()

class Filme(Base):
    __tablename__ = 'filmes'

    id = Column(Integer, primary_key=True)
    year = Column(Integer)
    title = Column(String)
    studios = Column(String)
    producers = Column(String)
    winner = Column(String)

    def to_dict(self):
        return {
            'id': self.id,
            'year': self.year,
            'title': self.title,
            'studios': self.studios,
            'producers': self.producers,
            'winner': self.winner
        }