from sqlalchemy.orm import Session
from config.database import engine
from models.pelicula_model import Pelicula

def obtener_peliculas():
    with Session(engine) as session:
        peliculas = session.query(Pelicula).all()
        return [p.to_dict() for p in peliculas]

def obtener_pelicula_por_id(pelicula_id):
    with Session(engine) as session:
        return session.query(Pelicula).filter(Pelicula.id == pelicula_id).first()

def crear_pelicula(data):
    with Session(engine) as session:
        nueva = Pelicula(
            titulo=data["titulo"],
            director=data["director"],
            anio=data["anio"],
            genero=data["genero"],
            duracion=data["duracion"],
            descripcion=data.get("descripcion", "")
        )
        session.add(nueva)
        session.commit()
        session.refresh(nueva)
        return nueva.to_dict()

def actualizar_pelicula(pelicula_id, data):
    with Session(engine) as session:
        pelicula = session.query(Pelicula).filter(Pelicula.id == pelicula_id).first()
        if not pelicula:
            return None

        pelicula.titulo = data.get("titulo", pelicula.titulo)
        pelicula.director = data.get("director", pelicula.director)
        pelicula.anio = data.get("anio", pelicula.anio)
        pelicula.genero = data.get("genero", pelicula.genero)
        pelicula.duracion = data.get("duracion", pelicula.duracion)
        pelicula.descripcion = data.get("descripcion", pelicula.descripcion)

        session.commit()
        return pelicula.to_dict()

def eliminar_pelicula(pelicula_id):
    with Session(engine) as session:
        pelicula = session.query(Pelicula).filter(Pelicula.id == pelicula_id).first()
        if not pelicula:
            return None
        
        session.delete(pelicula)
        session.commit()
        return {"mensaje": f"Pelicula con ID {pelicula_id} eliminada correctamente"}

