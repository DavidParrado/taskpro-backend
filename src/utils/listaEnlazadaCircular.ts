class Nodo<T> {
  valor: T;
  next: Nodo<T> | null;

  constructor(valor: T) {
    this.valor = valor;
    this.next = null;
  }
}

export class ListaEnlazadaCircular<T> {
  head: Nodo<T> | null;
  tail: Nodo<T> | null;

  constructor() {
    this.head = null;
    this.tail = null;
  }

  // Método para convertir un arreglo en una lista enlazada circular
  transformarArreglo(arr: T[]): void {
    if (arr.length === 0) {
      return; // Si el arreglo está vacío, no hacemos nada
    }

    arr.forEach((valor) => this.insertar(valor));
    if (this.tail && this.head) {
      this.tail.next = this.head; // Hacer la lista circular
    }
  }

  // Método para insertar un nuevo nodo
  insertar(valor: T): void {
    const nuevoNodo = new Nodo(valor);
    if (!this.head) {
      // Si la lista está vacía, el nuevo nodo es la cabeza y la cola
      this.head = nuevoNodo;
      this.tail = nuevoNodo;
    } else {
      // Si ya hay nodos, añadir el nuevo nodo al final
      if (this.tail) {
        this.tail.next = nuevoNodo;
      }
      this.tail = nuevoNodo;
    }
  }

  // Método para recorrer la lista circular y aplicar una acción sobre cada nodo
  recorrer(accion: (valor: T) => void): void {
    if (!this.head) {
      console.log("La lista está vacía, no hay nada que recorrer.");
      return; // Si la lista está vacía, salimos de la función
    }

    let actual = this.head;
    do {
      accion(actual.valor); // Ejecuta la acción proporcionada en cada nodo
      actual = actual.next as Nodo<T>;
    } while (actual !== this.head);
  }
}
