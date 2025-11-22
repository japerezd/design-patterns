/*
PATRONES CREACIONALES
*/

// ----------Factory pattern----------

// El Factory Pattern se usa cuando quieres crear objetos sin exponer la lógica exacta de creación, o cuando quieres centralizar y controlar cómo se instancian ciertos tipo
// Solo produce un solo tipo de producto por llamada (decide que clase concreta crear)
interface Food {
  prepare(): void
}

class Pizza implements Food {
  prepare(): void {
      console.log('Preparando pizza')
  }
}

class Sushi implements Food {
  prepare(): void {
      console.log('Preparando sushi')
  }
}

class Empanada implements Food {
  prepare(): void {
      console.log('Preparando empanadas');
  }
}

class Helado implements Food {
  prepare(): void {
      console.log('Preparando helado...');
      
  }
}

// Diccionario de construcciones - apuntando a los valores (que son las clases)
// as const - es solo readonly, no se puede modificar
const TiposDeComida = {
  pizza: Pizza,
  sushi: Sushi,
  empanada: Empanada,
  helado: Helado
} as const

class FoodFactory {
  static createFood(type: keyof typeof TiposDeComida): Food {
    return new TiposDeComida[type]();
  }
}

const factory = FoodFactory.createFood('helado')
factory.prepare()

// ----------Abstract factory----------
// Produce multiples productos relacionados.
// Decide qué conjunto de productos crear, asegurando consistencia entre ellos.
class MexicanPizza extends Pizza {
  prepare(): void {
      console.log('Preparando pizza mexicana');
  }
}

class JapanesePizza extends Pizza {
  prepare(): void {
      console.log('Preparando pizza japonesa');
  }
}

class JapaneseSushi extends Sushi {
  prepare(): void {
      console.log('Preparando sushi japonés');
  }
}

class MexicanSushi extends Sushi {
  prepare(): void {
      console.log('Preparando sushi mexicano (empanizado)');
  }
}

interface FoodFactory {
  createPizza(): Pizza
  createSushi(): Sushi
}

class MexicanFoodFactory implements FoodFactory {
  createPizza(): Pizza {
      return new MexicanPizza()
  }

  createSushi(): Sushi {
      return new MexicanSushi()
  }
}

class JapaneseFoodFactory implements FoodFactory {
  createPizza(): Pizza {
      return new JapanesePizza()
  }

  createSushi(): Sushi {
      return new JapaneseSushi()
  }
}

const mexicanPizza = new MexicanFoodFactory()
mexicanPizza.createPizza().prepare()

// ----------Builder----------
// Usarlo cuando un objeto tiene muchos parámetros opcionales.
class Lasaña {
  private size: string;
  private cheese: string

  // constructor(size: string, cheese: string) {
  //   this.size = size;
  //   this.cheese = cheese;
  // }
  constructor(builder: LasañaBuilder) {
    this.size = builder.size;
    this.cheese = builder.cheese;
  }

  describe() {
    console.log(`La lasaña es de tamaño ${this.size}, y tiene queso ${this.cheese}`);
  }
}

class LasañaBuilder {
  size: string = 'Mediana';
  cheese: string = 'mozzarella'

  setSize(size: string) {
    this.size = size
    return this
  }

  setCheese(cheese: string) {
    this.cheese = cheese
    return this
  }

  build(): Lasaña {
    // return new Lasaña(new LasañaBuilder())
    return new Lasaña(this)
  }
}

const lasaña = new LasañaBuilder().setSize('grande').setCheese('manchego').build()
lasaña.describe()

const lasañita = new LasañaBuilder().setSize('chica').build()
lasañita.describe();

// ----------Singleton----------
// Usada para una única instancia global
class ConfigManager {
  private static instance: ConfigManager;
  private config: Record<string, any> = {};

  private constructor() {
    // Default value
    // this.config = {}
  }

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager()
    }

    return ConfigManager.instance
  }

  set(key: string, value: any) {
    this.config[key] = value
  }

  get(key: string) {
    return this.config[key]
  }
}

const config1 = ConfigManager.getInstance()
config1.set('apiURL', 'https://www.homedepot.com')
const config2 = ConfigManager.getInstance()
console.log(config2.get('apiURL'));
console.log(config1 === config2);

// ----------Prototype----------
// Clonar objetos completos, sin tener que reconstruirlos
interface Clonable<T> {
  clone(): T
}

class Order implements Clonable<Order> {
  items: string[];
  address: string;

  constructor(items: string[], address: string) {
    this.items = items;
    this.address = address;
  }

  clone(): Order {
    return new Order([...this.items], this.address)
  }
}

const originalOrder = new Order(['pizza', 'tacos'], 'Pirita #80')
const clonedOrder = originalOrder.clone()
clonedOrder.items.push('tortas')

console.log('Original: ', originalOrder.items)
console.log('Cloned: ', clonedOrder.items)