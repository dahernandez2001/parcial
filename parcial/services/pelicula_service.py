from repositories.pelicula_repository import (
    obtener_peliculas,
    obtener_pelicula_por_id,
    crear_pelicula,
    actualizar_pelicula,
    eliminar_pelicula
)

def obtener_peliculas_service():
    return obtener_peliculas()

def obtener_pelicula_por_id_service(pelicula_id):
    pelicula = obtener_pelicula_por_id(pelicula_id)
    return pelicula.to_dict() if pelicula else None

def crear_pelicula_service(data):
    return crear_pelicula(data)

def actualizar_pelicula_service(pelicula_id, data):
    return actualizar_pelicula(pelicula_id, data)

def eliminar_pelicula_service(pelicula_id):
    return eliminar_pelicula(pelicula_id)
