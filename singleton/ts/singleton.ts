class SingletonTS {
  private static instanceTS: SingletonTS;
  public random: number;

  private constructor() {
    this.random = Math.random()
  }

  public static getInstance(): SingletonTS {
    if (!this.instanceTS) {
      this.instanceTS = new SingletonTS();
    }

    return this.instanceTS
  }
}

const singleton = SingletonTS.getInstance();
const singleton2 = SingletonTS.getInstance();
console.log(singleton.random)
console.log(singleton2.random)