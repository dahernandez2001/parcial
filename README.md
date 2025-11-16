# app# API
1. La carpeta Models tiene como función principal definir la forma en que se estructuran los datos dentro del proyecto. Es decir, aquí se crean los modelos que representan las tablas de la base de datos y se especifican los campos (columnas), tipos de datos, así como las relaciones entre entidades. En esta carpeta no se importan archivos de otras partes del proyecto, incluyendo configuraciones como la de la base de datos ubicada en la carpeta config. En su lugar, se trabaja únicamente con los módulos propios de SQLAlchemy, como:
sqlalchemy (para definir columnas, tipos de datos, claves primarias, etc.) sqlalchemy.orm (para manejar relaciones entre modelos y otras herramientas ORM) De este modo, los modelos se mantienen independientes de otras capas del proyecto, permitiendo una mejor organización y reutilización del código.


2. Carpeta Config: Esta carpeta es fundamental para que el sistema funcione correctamente, ya que aquí se gestionan las configuraciones necesarias para la aplicación. Entre sus archivos suele estar el archivo .env, donde se almacenan variables de entorno y otros datos sensibles o configurables. Además, esta carpeta actúa como una especie de base de datos simulada o punto central para la conexión y administración de la base de datos. En esta carpeta importamos desde Models la clase Base (que contiene la definición de los modelos) para poder crear e implementar las tablas en la base de datos. Es decir, aquí se orquesta la conexión real con la base de datos y se instancian las tablas que ya fueron definidas previamente en los modelos.

3. Carpeta repositories: Esta parte se ocupa de manejar todas las operaciones y acciones del sistema. Aquí se importan desde la carpeta Models las clases Libros y Autores para poder trabajar con ellas y ejecutar las diferentes instrucciones relacionadas con esos datos.

4. Carpeta service: Esta carpeta se encarga de gestionar las reglas de negocio del sistema. Desde aquí se realizan las validaciones necesarias para asegurar que los datos y las operaciones cumplan con las especificaciones y requisitos definidos. La carpeta Service recibe solicitudes desde los Controllers y se encarga de procesarlas, verificando que la información sea correcta y consistente antes de proceder. Además, esta capa se comunica de manera directa con la base de datos, para obtener, modificar o eliminar información según sea necesario. En este nivel, se importan datos desde la carpeta repositories (por ejemplo, la entidad autores) y también desde la carpeta Models (como el modelo Libro), integrando así la lógica con el acceso a los datos.


5. Carpeta Controlers:
Tiene la responsabilidad de recibir las solicitudes del usuario y luego lo entrega (controla las operaciones), actúa como un intermediario entre la capa de presentación (Ruta de una Api o Interfaz de usuario) y la lógica del negocio (Servicios - service).


Importancia de importar Blueprint: 
Se refiere a un contexto de frameworks web como Flask o Sanic. sirve para modularizar y organizar aplicaciones grandes, dividiéndolas en componentes más pequeños y reutilizables para mejorar la escalabilidad, la legibilidad del código y la colaboración en equipo.
Aquí importamos de la carpeta service los LibrosService



