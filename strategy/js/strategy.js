// Patrón de comportamiento
class SaleContext {
  constructor(strategy) {
    this.strategy = strategy
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  calculate(amount) {
    return this.strategy.calculate(amount)
  }
}

class RegularSalesStrategy {
  constructor (tax) {
    this.tax = tax
  }

  calculate(amount) {
    return amount + (amount * this.tax)
  }
}


class DiscountSaleStrategy {
  constructor (tax, discount) {
    this.tax = tax;
    this.discount = discount
  }

  calculate(amount) {
    return amount + (amount * this.tax) - this.discount
  }
}

class ForeingSaleStrategy {
  calculate(amount) {
    return amount * this.getDollarPrice()
  }

  getDollarPrice() {
    return 20;
  }
}

const regularSale = new RegularSalesStrategy(0.16)
const discountSale = new DiscountSaleStrategy(0.16, 3)
const foreingSale = new ForeingSaleStrategy()

const sale = new SaleContext(regularSale)
console.log(sale.calculate(10))

sale.setStrategy(discountSale)
console.log(sale.calculate(10))

sale.setStrategy(foreingSale)
console.log(sale.calculate(10))


// Caso practico
const data = [
  {
    name: 'Erdinger Pikantus',
    country: 'Alemania',
    info: 'Erdinger Pikantus es una cerveza de estilo weizenbock elaborada en la localidad bávara de Erding.',
    img: 'dxjcdxuv6chk2.cloudfront.net/assets/biere/flascheglas/pikantus-2020-v2.png',
  },

  {
    name: 'Corona',
    country: 'México',
    info: 'La cerveza Corona es una marca mundialmente conocida, distribuida a lo largo de más de 159 países en los cinco continentes.',
    img: 'upload.wikimedia.org/wikipedia/commons/0/0c/Corona-6Pack.JPG',
  },

  {
    name: 'Delirium Tremens',
    country: 'Bélgica',
    info: 'Esta pale ale tiene una efervescencia fina con un toque un tanto picante. Al tomarse, calienta el paladar y deja un sabor fuerte y de un amargor seco.',
    img: 'www.delirium.be/themes/custom/delirium/assets/img/beers/beer_delirium_tremens_bottle.png',
  },
];

class InfoContext {
  constructor (strategy, data, element) {
    this.setStrategy(strategy)
    this.data = data;
    this.element = element;
  }

  setStrategy(strategy) {
    this.strategy = strategy
  }

  show() {
    this.strategy.show(this.data, this.element)
  }
}

class ListStrategy {
  show(data, element) {
    element.innerHTML = data.reduce((acc, item) => {
      return acc + `
        <div>
          <h2>${item.name}</h2>
          <p>${item.country}</p>
        </div>
        <hr />
      `
    }, "")
  }
}

class DetailedListStrategy {
  show(data, element) {
    element.innerHTML = data.reduce((acc, item) => {
      return acc + `
        <div>
          <h2>${item.name}</h2>
          <p>${item.country}</p>
          <p>${item.info}</p>
        </div>
        <hr />
      `
    }, "")
  }
}

class ListWithImagesStrategy {
  show(data, element) {
    element.innerHTML = data.reduce((acc, item) => {
      return acc + `
        <div>
        <img width="10%" src="${item.img}" alt="${item.name}" />
        <h2>${item.name}</h2>
        </div>
        <hr />
      `
    }, "")
  }
}

const strategies = [
  new ListStrategy(),
  new DetailedListStrategy(),
  new ListWithImagesStrategy(),
]
// content is the id div from index.html
const info = new InfoContext(new ListStrategy(), data, content)
info.show()

// slcOptions comes from select id
slcOptions.addEventListener('change', (e) => {
  const option = e.target.value;
  info.setStrategy(strategies[option])
  info.show()
})