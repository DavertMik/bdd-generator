class BDDGenerator {

  constructor(num, opts = {}) {
    this.num = num;
    this.steps = [];
    this.scenarios = [];
  }

  generate() {
    this.generateSteps();
    return this.generateFeature();
  }

  generateFeature() {
    let feature = `Feature: ${faker.lorem.words(faker.random.number({ min: 3, max: 10 }))}\n\n`;

    for (let i = 0; i < this.num; i++) {
      this.scenarios.push(this.generateScenario());
    }

    return feature + this.scenarios.join('\n');
  }

  generateScenario() {
    let scenario = `Scenario: ${faker.lorem.words(faker.random.number({ min: 3, max: 10 }))}\n`

    let stepsNum = faker.random.number({ min: 2, max: 15 })
    let keyword;
    let prevKeyword;

    for (let i = 0; i < stepsNum; i++) {
      if (i < stepsNum / 3) {
        keyword = 'Given'
      } else if (i < 2 * stepsNum / 3) {
        keyword = 'When'
      } else {
        keyword = 'Then'
      }

      scenario += `${keyword == prevKeyword ? 'And' : keyword} ${faker.random.arrayElement(this.steps)}\n`

      prevKeyword = keyword;
    }

    return scenario;
  }

  generateSteps() {
    const maxSteps = faker.random.number({ min: this.num * 2, max: this.num * 4 });
    for (let i = 0; i < maxSteps; i++) {
      this.steps.push(this.createStep());
    }
  }

  createStep() {
    const hasParams = Math.random() > 0.7;

    if (!hasParams) {
      return faker.lorem.words(faker.random.number({ min: 3, max: 10 }));
    }

    const params = faker.random.number({ min: 1, max: 3 });

    let line = '';
    for (let i =0; i < params; i++) {
      line += faker.lorem.words(faker.random.number({ min: 1, max: 3 })) + ` "${faker.hacker.noun()}" `
    }
    return line
  }

  createScenario() {

  }
}

