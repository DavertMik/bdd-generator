class BDDGenerator {

  constructor(num, opts = {}) {
    this.num = num;
    this.steps = [];
    this.scenarios = [];
    this.hasOutline = opts.hasOutline;
    this.background = opts.background;
    this.tags = opts.tags;
  }

  generate() {
    this.generateSteps();
    return this.generateFeature();
  }

  generateFeature() {
    let feature = `Feature: ${faker.lorem.words(faker.random.number({ min: 3, max: 10 }))}\n\n`;

    if (this.tags) {
      feature = this.generateTags() + '\n' + feature;
    }

    if (this.background) {
      feature += "Background: \n";
      let keyword = 'Given'
      for (let i = 0; i < faker.random.number({ min: 2, max: 5 }); i++) {
        feature += `  ${keyword} ${this.createStep()}\n`;
        keyword = 'And'
      }
      feature+= '\n';
    }

    for (let i = 0; i < this.num; i++) {
      this.scenarios.push(this.generateScenario());
    }

    feature += this.scenarios.join('\n');

    while (feature.includes('<param')) {
      feature = feature.replace(/<param\d*\>/, `"${faker.hacker.noun()}"`);
    }

    feature = feature.replace(/</g, "&lt;");
    feature = feature.replace(/>/g, "&gt;");
    return feature;
  }

  generateScenario() {

    let isOutline = this.hasOutline && Math.random() > 0.8;

    let scenario = `Scenario: ${faker.lorem.words(faker.random.number({ min: 3, max: 10 }))}\n`


    if (this.tags) {
      scenario = this.generateTags() + '\n' + scenario;
    }



    if (isOutline) scenario = `Scenario Outline: ${faker.lorem.words(faker.random.number({ min: 3, max: 10 }))}\n`

    let stepsNum = faker.random.number({ min: 2, max: 15 })
    let keyword;
    let prevKeyword;
    let numParams = 0;
    let prevStep;

    for (let i = 0; i < stepsNum; i++) {
      if (i < stepsNum / 3) {
        keyword = 'Given'
      } else if (i < 2 * stepsNum / 3) {
        keyword = 'When'
      } else {
        keyword = 'Then'
      }

      let step = faker.random.arrayElement(this.steps);
      if (step === prevStep) {
        step = faker.random.arrayElement(this.steps);
      }
      if (step.includes('<param') && isOutline) {
        numParams++;
        // numParams = (step.match(/\<param/g) || []).length;
        step = step.replace(/\<param\d+/, `<example${numParams}`);
      }
      scenario += `  ${keyword == prevKeyword ? 'And' : keyword} ${step}\n`

      prevStep = step;
      prevKeyword = keyword;
    }

    if (isOutline && numParams < 1) {
      let step = this.createStep(true)
      numParams = (step.match(/\<param/g) || []).length;
      step = step.replace(/\<param/g, `<example`);
    }

    if (isOutline) {
      scenario += this.generateExamples(numParams);
    }

    return scenario;
  }

  generateTags() {
    let tagsLine = ''
    for (let i = 0; i < faker.random.number({ min: 0, max: 5 }); i++) {
      tagsLine += `@${faker.system.fileExt()} `
    }
    return tagsLine.trim();
  }

  generateExamples(numParams) {
    let examples = `\nExamples:\n`;

    let header = '    |';
    for (let i = 1; i <= numParams; i++) {
      header += ` example${i} |`;
    }

    examples += header + '\n';

    let examplesNum = faker.random.number({ min: 2, max: 15 })

    for (let i = 0; i < examplesNum; i++) {
      let vals = []
      for (let j = 0; j < numParams; j++) {
        vals.push(faker.company.bsBuzz());
      }
      examples += '    | ' + vals.join(' | ') + ' | \n';
    }
    return examples + '\n';
  }

  generateSteps() {
    const maxSteps = faker.random.number({ min: this.num * 2, max: this.num * 4 });
    for (let i = 0; i < maxSteps; i++) {
      this.steps.push(this.createStep());
    }
  }

  createStep(hasParams = false) {
    if (!hasParams) hasParams = Math.random() > 0.7;

    if (!hasParams) {
      return faker.lorem.words(faker.random.number({ min: 3, max: 10 }));
    }

    const params = faker.random.number({ min: 1, max: 3 });

    let line = '';
    for (let i =0; i < params; i++) {
      line += faker.lorem.words(faker.random.number({ min: 1, max: 3 })) + ` <param${i}> `
    }
    return line
  }

  createScenario() {

  }
}

