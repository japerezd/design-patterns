console.log('Hello world TS');

class Drink {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  info(): string {
    return this.name;
  }
}

const drink = new Drink('Agua');
console.log(drink.info());

// Interface
interface Product {
  price: number;
  getPrice(): string
}

// Inheritance
class Beer extends Drink implements Product {
  private alcohol: number;
  price: number;

  constructor(name: string, alcohol: number, price: number) {
    super(name)
    this.alcohol = alcohol
    this.price = price;
  }

  getPrice() {
    return '$' + this.price
  }

  info() : string {
    return super.info() + " " + this.alcohol
  }
}

// Interface implementation
class Snack implements Product {
  name: string;
  price: number;

  constructor(name: string, price: number) {
    this.name = name;
    this.price = price;
  }

  getPrice() {
    return `El precio es: ${this.price}`
  }
}

const beer = new Beer('Indio', 4, 20)
console.log(beer.info())

const products: Product[] = [
  new Beer('XX', 3, 18),
  new Snack('papas', 15)
]

function getPrices(items: Product[]) {
  for (const item of items) {
    console.log(item.getPrice())
  }
}

getPrices(products)