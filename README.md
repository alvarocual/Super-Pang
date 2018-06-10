# Super Pang
## Enlace del juego
https://alvarocual.github.io/Super-Pang/

# Memoria
## Índice:

### 1. Diseño del juego
	- Objetivo del juego
	- Principales mecánicas
	- Personajes
  
### 2. Diseño de la implementación
	- Arquitectura
	- Principales componentes
  
### 3. Equipo de trabajo y reparto de tareas

### 4. Fuentes y referencias

# 1. Diseño del juego

Este videojuego es una versión personalizada del modo de juego conocido como Panic Mode del videojuego original de capcom: Super Pang, lanzado en 1990 y publicado por Nintendo.
En la versión original, el jugador debía destruir una serie de bolas y rocas para ir pasando de nivel y ganar puntos con bola o roca destruida. Si alcanzaba el último nivel y destruía todas las bolas restantes ganaba la partida.
Nota: a partir de ahora no referiremos a la combinación :bolas/rocas, como proyectiles.

## 1.1 Objetivo del juego

En nuestra versión seguimos una premisa parecida, el jugador debe destruir los proyectiles a medida que los niveles se suceden para, en el último nivel, destruir una bola especial que le dará la victoria. Si alguna de los proyectiles alcanza al personaje este morirá y el jugador deberá volver a empezar desde el principio.

## 1.2 Principales mecánicas

### Desplazamiento lateral: 
El jugador puede desplazar al personaje lateralmente por el escenario para esquivar los proyectiles antes de que le golpeen.

### Disparo de arpón: 
El jugador puede disparar hasta 4 arpones simultáneos para tratar de romper los proyectiles y eliminarlos. Una vez disparados los 4, no podrá disparar ningún otro arpón hasta que algunos de los anteriores se destruya, bien al chocar con una de los proyectiles o con el techo del escenario.

### Fragmentación de las objetos: 
Cuando alguna de los proyectiles colisione con algún arpón, éste se fragmentará en otros 2 más pequeños que continuarán rebotando por el escenario hasta ser alcanzados de nuevo por un arpón y se volverán a subdividir como el anterior. Así hasta alcanzar el proyectil más pequeño de todos que, simplemente, desaparecerá cuando colisione con el arpón.

### Muerte: 
Si el personaje colisiona con algún proyectil morirá y deberá volver a empezar la partida.

### Victoria: 
Si el jugador destruye la bola especial ganará la partida y podrá volver al menú de inicio tras ver los títulos de crédito.

## 1.3 Personajes
		
### Jugador: 
El chico de los arpones, debe viajar por todo el mundo para acabar con la invasión de esferas y hexágonos que asolan la tierra.

### Enemigos: 
Las bolas y los hexágonos que rebotan por el escenario en su esperanza de aplastar al jugador en alguno de sus impactos, rompe una y otras dos la sustituirán (hasta que solo queden las más pequeñas, esas ya mueren).

# 2. Diseño e implementación

El código al completo se encuentra estructurado en un solo archivo: superPang.js, en la carpeta src.
	Las bibliotecas de Quitus están en la carpeta lib.
	Los archivos .json para compilar los sprites se encuentran en la carpeta data
	Las pistas de audio se encuentran en la carpeta audio.
	Los sprites e imágenes se encuentran en la carpeta images.

## Principales componentes del código:

### Pantallas de título y créditos: 
En esta sección tenemos las imágenes de la pantalla de inicio y de créditos del juego, así como sus respectivas escenas para insertarlas en el juego, mostrar las opciones disponibles al usuario y reproducir la música correspondiente en esta sección.

### Carga del nivel y de los fondos: 
Contiene la escena del fondo y se encarga de inicializar el escenario de juego, posicionando las paredes y el personaje, iniciando la música de la partida, reseteando las variables globales para poder empezar la partida de cero e inicializando el bucle del juego.

### Carga de recursos: 
Carga y compila todos los archivos necesarios para el funcionamiento del juego la primera vez que se carga el mismo, después llama a la pantalla de título del juego.

### Gestión de animaciones: 
Alberga todas las animaciones del juego y se encarga de activar los triggers de cada clase cuando corresponda.

### Sprites para el fondo y las paredes del escenario: 
Una colección de clases bastante simples, ya que contienen los sprites del fondo y del escritorio, simplemente.

### Sprites de los enemigos (y la gestión de colisiones): 
Estas clases se encargan, además de de sus propios sprites, de gestionar las colisiones de con los demás objetos del escenario, estas son: las colisiones con las paredes, con las cuales rebotarán, colisiones con los arpones, con quienes serán destruidas y destruirán, y colisiones con el jugador, al cual eliminarán provocando el fin de la partida por derrota.

### Sprites de las explosiones de los enemigos: 
Cada una de estas clases se corresponde con una de las anteriores (excepto BolaEspecial, que no tiene explosión), y su función es la de activar la animación de una serie de sprites para representar la destrucción de un enemigo. No tienen ningún tipo de colisión con nada.

### Sprites de los arpones del jugador: 
Es el arma del jugador, esta clase se encarga de cargar un arpón cada vez que el jugador presiona la tecla “espacio”, controlando su velocidad y punto de origen.

### Sprite del jugador: 
Controla el movimiento del personaje, provoca el lanzamiento del arpón cuando el jugador pulsa “espacio” (llamando a la clase anterior) y se encarga, además,de finalizar la partida cuando el jugador muere o gana reproduciendo la música correspondiente.

# 3. Reparto de tareas

### Javier Carrión García: 
El responsable de grabar y editar el gameplay para la entrega final, también se encargó de profundizar en el motor de Quintus para solucionar los problemas de colisiones entre sprites y su correcta posición en el escenario. 
Carga de trabajo: 33’3%.

### Álvaro Cuevas Álvarez: 
Encargado de buscar y editar los sprites para el juego, además es el creador del bucle del juego y diseñador de la dificultad, así como de las condiciones de victoria del mismo.
Carga de trabajo: 33’3%.

### Alejandro García Montero: 
Responsable de buscar y editar la música y los efectos de sonido para el juego y de crear el primer borrador de la memoria. 
Carga de trabajo: 33’3%.

### Todos: 
Además de durante las horas de clase, los miembros del equipo hemos quedado semanalmente desde que comenzó el proyecto para avanzar en la programación del código y ayudarnos con las dudas y problemas que fueron surgiendo durante el proceso.

# 4. Referencias

## Sprites:
### Fondos: 
https://www.spriters-resource.com/snes/superbusterbros/sheet/34370/

### Jugador y enemigos:
https://www.spriters-resource.com/arcade/superpang/sheet/60043/
		
### Explosiones:
 http://spritedatabase.net/file/7220/Player_Enemies_and_Miscellaneous

## Sonido:
### Efectos:
https://www.zapsplat.com/

### Música:
https://downloads.khinsider.com/game-soundtracks/album/pang-buster-bros
