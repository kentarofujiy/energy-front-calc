import { QuestionBase } from './question-base';

export class SliderQuestion extends QuestionBase<string> {
  controlType = 'slider';
  options: {key: string, value: string}[] = [];
  type: string;
  

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}