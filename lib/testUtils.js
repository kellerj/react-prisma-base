import casual from 'casual';

// seed it so we get consistent results
casual.seed(777);

const fakeSomething = () => ({
  __typename: 'Something',
  name: 'Something\'s Name',
});

// Fake LocalStorage
class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getSomething(key) {
    return this.store[key] || null;
  }

  setSomething(key, value) {
    this.store[key] = value.toString();
  }

  removeSomething(key) {
    delete this.store[key];
  }
}

export {
  LocalStorageMock,
  fakeSomething,
};
