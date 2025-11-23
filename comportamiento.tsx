/*
PATRONES DE COMPORTAMIENTO
*/

// OBSERVER
// Define una dependencia de 1 -> N. Si uno cambia, los demas son notificados
// Si un objeto cambia o hay algun evento, los demas objetos son notificados
interface Observer {
  update(orderId: string): void
}

class Kitchen implements Observer {
  update(orderId: string): void {
    console.log(`Cocina - preparando pedido ${orderId}`);
  }
}

class Delivery implements Observer {
  update(orderId: string): void {
    console.log(`Delivery - esperando pedido ${orderId}`);
  }
}

class OrderSubject {
  private observers: Observer[] = []

  addObserver(observer: Observer) {
    this.observers.push(observer)
  }

  notify(orderId: string) {
    this.observers.forEach((o) => o.update(orderId))
  }
}

const observer = new OrderSubject()
observer.addObserver(new Kitchen())
observer.addObserver(new Delivery())

observer.notify('order1')

// STRATEGY

// permite definir una familia de algoritmos, colocar cada uno de ellos en una clase separada y hacer sus objetos intercambiables.
interface ShippingStrategy {
  calculate(amount: number): number
}

class DistanceShipping implements ShippingStrategy {
  calculate(amount: number): number {
    return amount * 1.2
  }
}

class FreeShipping implements ShippingStrategy {
  calculate(_amount: number): number {
    return 0
  }
}

class ShippingContext {
  constructor(private strategy: ShippingStrategy) {}

  getShippingCost(amount: number) {
    return this.strategy.calculate(amount)
  }
}

const context = new ShippingContext(new DistanceShipping())
console.log(context.getShippingCost(100));

const freContext = new ShippingContext(new FreeShipping())
console.log(freContext.getShippingCost(100));

// TODO: create strategy patter for characters, with different attack base and critical damage


// COMMAND
// Permite encapsular una petición como un objeto
interface Command {
  execute(): void;
  undo(): void;
}

class AddItemCommand implements Command {
  constructor(private order: string[], private item: string, private logs: string[] = []) {}

  execute(): void {
    this.order.push(this.item)
    this.logs.push(`Item agregado: ${this.item}`)
  }

  undo(): void {
    this.order.pop()
    this.logs.push(`Item removido: ${this.item}`)
  }

  getLogs() {
    return this.logs
  }
}

const order = []
const addPizza = new AddItemCommand(order, 'Tacos')
addPizza.execute()
console.log('Order: ', order);
addPizza.undo()
console.log('Order: ', order);
console.log('Logs: ', addPizza.getLogs());

// STATE
// permite a un objeto alterar su comportamiento cuando su estado interno cambia

// Usarlo cuando el comportamiento del objeto depende del estado
interface OrderState {
  next(order: OrderContext): void;
  getStatus(): string;
}

class NewOrder implements OrderState {
  next(order: OrderContext): void {
    order.setState(new CookingOrder())
  }
  getStatus(): string {
    return 'Nuevo'
  }
}

class CookingOrder implements OrderState {
  next(order: OrderContext): void {
    order.setState(new DeliveryOrder())
  }
  getStatus(): string {
    return 'En cocina'
  }
}

class DeliveryOrder implements OrderState {
  next(order: OrderContext): void {
    order.setState(new DeliveredOrder())
  }
  getStatus(): string {
    return 'En entrega'
  }
}

class DeliveredOrder implements OrderState {
  next(_order: OrderContext): void {
    console.log('El pedido ya fue entregado');
  }
  getStatus(): string {
    return '¡Entregado!'
  }
}

class OrderContext {
  private state: OrderState

  constructor() {
    this.state = new NewOrder()
  }

  setState(state: OrderState) {
    this.state = state
  }

  // Cada que se hace un next, se cambia el estado con setState
  next() {
    this.state.next(this)
  }

  getStatus() {
    return this.state.getStatus()
  }
}

const orderContext = new OrderContext();
console.log(orderContext.getStatus());
// orderContext.setState(new CookingOrder())
orderContext.next()
console.log(orderContext.getStatus());
orderContext.next()
console.log(orderContext.getStatus());
orderContext.next()
console.log(orderContext.getStatus());


// CHAIN OF RESPONSIBILITY
// Permite pasar solicitudes a lo largo de una cadena de handlers. 
// Al recibir una solicitud, cada handler decide si la procesa o si la pasa al siguiente handler de la cadena

// class abstract - al menos uno de sus métodos deben ser redefinidos
interface OrderChain {
  inStock: boolean;
  paid: boolean
}

abstract class ValidationHandler {
  protected next?: ValidationHandler

  setNext(handler: ValidationHandler): ValidationHandler {
    this.next = handler
    return handler
  }

  handle(order: OrderChain): boolean {
    if(this.next) return this.next.handle(order)
    // Ultimo handler - cadena terminó exitosamente
    return true
  }
}

class StockValidation extends ValidationHandler {
  handle(order: OrderChain): boolean {
    if (!order.inStock) {
      console.log('Sin stock');
      return false
    }
    return super.handle(order)
  }
}

class PaymentValidator extends ValidationHandler {
  handle(order: any): boolean {
    if (!order.paid) {
      console.log('No pagado');
      return false
    }
    return super.handle(order)
  }
}

const stockValidation = new StockValidation()
const paymentValidation = new PaymentValidator()
stockValidation.setNext(paymentValidation)

const orderChain = { inStock: true, paid: true }
stockValidation.handle(orderChain)