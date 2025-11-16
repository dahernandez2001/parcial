from sqlalchemy import Column, Integer, String, Text
from config.database import Base

class Pelicula(Base):
    __tablename__ = "peliculas"

    id = Column(Integer, primary_key=True, autoincrement=True)
    titulo = Column(String(200), nullable=False)
    director = Column(String(150), nullable=False)
    anio = Column(Integer, nullable=False)
    genero = Column(String(100), nullable=False)
    duracion = Column(Integer, nullable=False)
    descripcion = Column(Text, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "titulo": self.titulo,
            "director": self.director,
            "anio": self.anio,
            "genero": self.genero,
            "duracion": self.duracion,
            "descripcion": self.descripcion
        }
