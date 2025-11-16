from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from services.pelicula_service import (
    obtener_peliculas_service,
    obtener_pelicula_por_id_service,
    crear_pelicula_service,
    actualizar_pelicula_service,
    eliminar_pelicula_service
)

peliculas_bp = Blueprint("peliculas", __name__)

@peliculas_bp.route("/peliculas", methods=["GET"])
@jwt_required()
def listar_peliculas():
    peliculas = obtener_peliculas_service()
    return jsonify(peliculas), 200

@peliculas_bp.route("/peliculas/<int:pelicula_id>", methods=["GET"])
def obtener_pelicula(pelicula_id):
    pelicula = obtener_pelicula_por_id_service(pelicula_id)
    if not pelicula:
        return jsonify({"error": "Pelicula no encontrada"}), 404
    return jsonify(pelicula), 200

@peliculas_bp.route("/peliculas", methods=["POST"])
@jwt_required()
def crear_pelicula():
    data = request.get_json()
    if not data or "titulo" not in data:
        return jsonify({"error": "Datos inválidos"}), 400
    
    nueva = crear_pelicula_service(data)
    return jsonify(nueva), 201

@peliculas_bp.route("/peliculas/<int:pelicula_id>", methods=["PUT"])
@jwt_required()
def actualizar_pelicula(pelicula_id):
    data = request.get_json()
    pelicula = actualizar_pelicula_service(pelicicula_id, data)

    if not pelicula:
        return jsonify({"error": "Pelicula no encontrada"}), 404
    
    return jsonify(pelicula), 200

@peliculas_bp.route("/peliculas/<int:pelicula_id>", methods=["DELETE"])
@jwt_required()
def eliminar_pelicula(pelicula_id):
    resultado = eliminar_pelicula_service(pelicula_id)

    if not resultado:
        return jsonify({"error": "Pelicula no encontrada"}), 404
    
    return jsonify(resultado), 200
