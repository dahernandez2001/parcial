# seed_peliculas.py
from sqlalchemy.orm import Session
from config.database import engine, Base
from models.pelicula_model import Pelicula

# Crear tablas si no existen
Base.metadata.create_all(bind=engine)

# Insertar películas de ejemplo
with Session(engine) as session:
    peliculas = [
        Pelicula(
            titulo="Inception",
            director="Christopher Nolan",
            anio=2010,
            genero="Ciencia Ficción",
            duracion=148,
            descripcion="Un ladrón que roba secretos mediante el uso de la tecnología de los sueños."
        ),
        Pelicula(
            titulo="The Matrix",
            director="The Wachowskis",
            anio=1999,
            genero="Ciencia Ficción",
            duracion=136,
            descripcion="Un hacker descubre que la realidad es una simulación creada por máquinas."
        ),
        Pelicula(
            titulo="Interstellar",
            director="Christopher Nolan",
            anio=2014,
            genero="Aventura",
            duracion=169,
            descripcion="Un grupo de exploradores viaja a través de un agujero de gusano en busca de un nuevo hogar para la humanidad."
        ),
        Pelicula(
            titulo="Parasite",
            director="Bong Joon-ho",
            anio=2019,
            genero="Thriller",
            duracion=132,
            descripcion="Una familia pobre se infiltra en la vida de una familia rica."
        ),
        Pelicula(
            titulo="The Godfather",
            director="Francis Ford Coppola",
            anio=1972,
            genero="Drama",
            duracion=175,
            descripcion="La historia de la familia Corleone y su imperio criminal."
        )
    ]

    session.add_all(peliculas)
    session.commit()

print("✅ Películas de ejemplo insertadas correctamente.")
