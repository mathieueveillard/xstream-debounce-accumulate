import { Stream } from 'xstream';
import { TimeSource } from '@cycle/time';
export interface DebounceAndAccumulateSettings<T> {
    period: number;
    accumulate: (accumulator: T, current: T) => T;
    seed: T;
}
export default function makeDebounceAndAccumulate<T>(timeSource: TimeSource): ({ period, accumulate, seed }: DebounceAndAccumulateSettings<T>) => ($: Stream<T>) => Stream<T>;
