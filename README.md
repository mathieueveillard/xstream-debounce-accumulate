# xstream-debounce-accumulate

An xstream operator that debounces a stream but accumulates values meantime. It's a derivative of xstream's regular [`debounce()`](https://github.com/staltz/xstream/blob/master/EXTRA_DOCS.md#debounce) operator.

## Marble diagram

Marble diagram of `debounce(80)`, given that `-` is 20 (ms).

```
input$:     --1------1-1-1-11-1-----1------
output$:    ------1---------------6-----1--
```

## API

```TypeScript
import { Stream } from 'xstream';
import { TimeSource } from '@cycle/time';

export interface DebounceAndAccumulateSettings<T> {
  period: number;
  accumulate: (accumulator: T, current: T) => T;
  seed: T;
}

export default function makeDebounceAndAccumulate<T>(timeSource: TimeSource): ({ period, accumulate, seed }: DebounceAndAccumulateSettings<T>) => ($: Stream<T>) => Stream<T>;
```

## Installation

```
npm i xstream-debounce-accumulate --save
```

## Usage

```TypeScript
import { Stream } from 'xstream';
import { DebounceAndAccumulateSettings } from 'xstream-debounce-accumulate';
import makeDebounceAndAccumulate from 'xstream-debounce-accumulate';

const debounceAndAccumulate = makeDebounceAndAccumulate(timeSource);

const settings: DebounceAndAccumulateSettings<number> = {
  period: 80,
  accumulate: (accumulator: number, current: number) => accumulator + current,
  seed: 0
};

const $: Stream<number> = ...
const debounced$: Stream<number> = $.compose(debounceAndAccumulate(settings));
```

`timeSource: TimeSource` originates from the application bootstrap. Please refer to [@cycle/time](https://www.npmjs.com/package/@cycle/time) documentation for detailed information on `TimeSource`.

## Implementation note

`makeDebounceAndAccumulate` is a function that, invoked with a `timeSource`, returns an operator factory. This factory, in turn, invoked with settings, returns an operator. This is to say: please be aware that `makeDebounceAndAccumulate()` doesn't return an operator but an operator factory. There are two higher order functions above the operator.

The reason for this is that `timeSource` is a fixed value, provided once and for all at the bootstrap of your application, while you may want to use different settings each time you need to use this operator.

Finally, a word on naming. Above, we wrote:

```TypeScript
const debounceAndAccumulate = makeDebounceAndAccumulate(timeSource);
```

and, later:

```TypeScript
const debounced$ = $.compose(debounceAndAccumulate(settings));
```

This suggests `debounceAndAccumulate` is an operator, which strictly speaking is false since it is an operator factory. However, we suggest to use this naming in order to stay consistent with the regular [`debounce()`](https://github.com/staltz/xstream/blob/master/EXTRA_DOCS.md#debounce) operator's naming convention, which allows to write `$.compose(debounce(60))`. The same consideration applies.

Please keep that in mind and you'll be safe!
