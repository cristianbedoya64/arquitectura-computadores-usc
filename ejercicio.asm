# Ejemplo de código ensamblador MIPS
# Carga dos valores, los suma y guarda el resultado

li $t0, 5       # Cargar el valor 5 en el registro $t0
li $t1, 10      # Cargar el valor 10 en el registro $t1
add $t2, $t0, $t1 # Sumar $t0 y $t1, guardar el resultado en $t2
sw $t2, 0($t3)  # Guardar el valor de $t2 en la dirección apuntada por $t3