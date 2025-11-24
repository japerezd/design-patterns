export {}
/*
PATRONES ESTRUCTURALES
*/

// ADAPTER
// Permite la colaboración entre objetos con interfaces incompatibles.
// Interfaz esperada
interface Payment {
  pay(amount: number): void
}

// Servicio externo
class StripeService {
  makePayment(value: number) {
    console.log(`Pagando $${value} con Stripe`)
  }
}

class StripeAdapter implements Payment {
  constructor(private stripe: StripeService) {}

  pay(amount: number): void {
      this.stripe.makePayment(amount)
  }
}

const pago = new StripeAdapter(new StripeService())
pago.pay(90)

// DECORATOR
// Extiende funcionalidad de algo que antes no tenia
interface Food {
  getDescription(): string
  getCost(): number
}

class BasicFood implements Food {
  getDescription(): string {
      return 'Papas en gajo'
  }

  getCost(): number {
      return 50
  }
}

class CheeseDecorator implements Food {
  constructor(private food: Food) {}

  getDescription(): string {
    return `${this.food.getDescription()} con queso extra`
  }

  getCost(): number {
    return this.food.getCost() + 15
  }
}

class BaconDecorator implements Food {
  constructor(private food: Food) {}


  getDescription(): string {
    return `${this.food.getDescription()} con tocino extra`
  }

  getCost(): number {
    return this.food.getCost() + 20
  }
}

let pizza: Food = new BasicFood()
pizza = new CheeseDecorator(pizza)
pizza = new BaconDecorator(pizza)
console.log('Costo: ', pizza.getCost());
console.log('Descripcion: ', pizza.getDescription());

// FACADE
// Proporciona una interfaz simplificada a una biblioteca, un framework o cualquier otro grupo complejo de clases.

class OrderService {
  createOrder() {
    console.log('Orden creada');
  }
}

class PaymentService {
  processPayment() {
    console.log('Pago procesado');
  }
}

class DeliveryService {
  dispatchOrder() {
    console.log('Pedido despachado');
  }
}

class OrderFacade {
  constructor(
    private order: OrderService,
    private payment: PaymentService,
    private delivery: DeliveryService
  ){}

  placeOrder() {
    this.order.createOrder();
    this.payment.processPayment();
    this.delivery.dispatchOrder()
  }
}

const facade = new OrderFacade(new OrderService(), new PaymentService(), new DeliveryService())
facade.placeOrder()

// COMPOSITE
// Permite componer objetos en estructuras de árbol y trabajar con esas estructuras como si fueran objetos individuales
// Es como una estructura jerárquica
interface FoodItem {
  getName(): string
  getPrice(): number
}

class SimpleFood implements FoodItem {
  constructor(private name: string, private price: number){}

  getName(): string {
    return this.name
  }

  getPrice(): number {
    return this.price
  }
}

class Combo implements FoodItem {
  private items: FoodItem[] = []

  add(item: FoodItem) {
    this.items.push(item)
  }

  getName(): string {
    return `Combo: ${this.items.map((i) => i.getName()).join(', ')}`
  }

  getPrice(): number {
    return this.items.reduce((sum, item) => sum + item.getPrice(), 0)
  }
}

const tortas = new SimpleFood('Tortas', 100)
const tacos = new SimpleFood('Tacos', 70)
const combo = new Combo()

combo.add(tortas)
combo.add(tacos)

console.log(combo.getName());
console.log(combo.getPrice());

// PROXY
// Permite proporcionar un sustituto o marcador de posición para otro objeto, permitiéndote hacer algo antes o después de que la solicitud llegue al objeto original.
interface OrderHistory {
  getOrders(userId: string): string[]
}

class RealOrderHistory implements OrderHistory {
  getOrders(userId: string): string[] {
    console.log(`Consultando la base de datos del ${userId}`);
    return ["Order 1", "Orden 2"]
  }
}

class OrderHistoryProxy implements OrderHistory {
  private cache: Record<string, string[]> = {}
  constructor(private realHistory: RealOrderHistory){}

  getOrders(userId: string): string[] {
    if(!this.cache[userId]) {
      this.cache[userId] = this.realHistory.getOrders(userId)
    }
    return this.cache[userId]
  }
}

// Recurso estrella = aquel recurso que se pide constantemente

const history = new OrderHistoryProxy(new RealOrderHistory())
console.log(history.getOrders('user1'));
console.log(history.getOrders('user1'));
console.log(history.getOrders('user2'));
console.log(history.getOrders('user2'));
console.log(history.getOrders('user3'));
console.log(history.getOrders('user4'));
