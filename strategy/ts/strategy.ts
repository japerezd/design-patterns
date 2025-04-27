interface Strategy {
  login(user: string, password: string): boolean
}

class LoginContext {
  private strategy: Strategy;

  constructor(strategy: Strategy) {
    this.setStategy(strategy)
  }

  setStategy(strategy: Strategy) {
    this.strategy = strategy
  }

  login (user: string, password: string) {
    return this.strategy.login(user, password);
  }
}

class LoginDBStrategy implements Strategy {
  login (user: string, password: string) {
    console.log('Dirigiendonos a la base de datos');
    if (user === 'admin' && password === 'entra') {
      console.log('Logeado')
      return true;
    }
    console.log('Error')
    return false;
  }
}

class LoginServiceStrategy implements Strategy {
  login (user: string, password: string) {
    console.log('Dirigiendonos a un servicio de autentificación');
    if (user === 'admin' && password === 'entra') {
      console.log('Logeado')
      return true;
    }
    console.log('Error')
    return false;
  }
}

class LoginGoogleStrategy implements Strategy {
  login (user: string, password: string) {
    console.log('Dirigiendonos a un servicio de Google');
    if (user === 'admin' && password === 'entra') {
      console.log('Logeado')
      return true;
    }
    console.log('Error')
    return false;
  }
}


const auth = new LoginContext(new LoginDBStrategy())
auth.login('admin', 'entra');

auth.setStategy(new LoginServiceStrategy())
auth.login('admin', 'entra');

auth.setStategy(new LoginGoogleStrategy())
auth.login('admin', 'entra');