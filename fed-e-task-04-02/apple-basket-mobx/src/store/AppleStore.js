import { action, computed, observable } from 'mobx';

class AppleStore {
  @observable apples = [];
  @observable qty = 0;
  @observable weight = 0;
  @observable eatenWeight = 0;

  @action.bound pickApple () {
    this.qty = this.qty + 1;
    const apple = {
      id: this.qty,
      weight: Math.floor(200 + Math.random() * 50),
      isEaten: false
    }
    this.weight += apple.weight;
    this.apples.push(apple);
  }

  @action.bound eatApple (id) {
    this.apples.forEach(apple => {
      if (apple.id === id) {
        apple.isEaten = true;
        this.eatenWeight += apple.weight;
      }
    });
  }

  @computed get leftoverApples () {
    return this.apples.filter(apple => apple.isEaten === false);
  }

  @computed get numberOfLeftover () {
    return this.apples.filter(apple => apple.isEaten === false).length;
  }

  @computed get numberOfEaten () {
    return this.apples.filter(apple => apple.isEaten === true).length;
  }

  @computed get weightOfLeftover () {
    return this.weight - this.eatenWeight;
  }

}

const apples = new AppleStore()

export default apples;