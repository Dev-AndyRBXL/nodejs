class Person {
  constructor(name, age) {
    this.name = name || 'John Doe';
    this.age = age;
  }

  greeting() {
    console.log(`Hello, my name is ${this.name}! My age is ${this.age}`);
  }
}

const person1 = new Person('', 15);
