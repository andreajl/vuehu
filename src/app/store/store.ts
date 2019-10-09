import {
  Subject,
  merge,
  OperatorFunction,
  MonoTypeOperatorFunction,
} from 'rxjs';
import {
  startWith,
  scan,
  publishReplay,
  refCount,
  filter,
} from 'rxjs/operators';

const action$ = new Subject();

/*
 *  Action Creators
 */

export type Payload = any;

export type Action = {
  type: string;
  payload?: Payload;
};

export const createAction = ({ type, payload }: Action): void => {
  action$.next({ type, payload });
};

/*
 *  Reducer Creators
 */

export type Reducer<State, Payload> = (
  previousState: State,
  payload: Payload
) => State;

type ReducerEntry<State> = Reducer<State, Payload>;

export type ReducerDefinition<State> = {
  [x: string]: ReducerEntry<State>;
};

export const createReducers = <State>(handler: ReducerDefinition<State>) => (
  state: State,
  { type, payload }: Action
): State => (handler[type] && handler[type](state, payload)) || state;

/*
 *  Routine Creators
 */

export type Routine<T> = <T>(
  action: Subject<T>
) => OperatorFunction<Action, Subject<T>>;

export const createRoutines = <T>(
  routines: (action$: Subject<any>) => Routine<T>[]
) => routines;

type ReducerFunction<State> = (
  state: State,
  { type, payload }: Action
) => State;

/*
 *  Stream State Creator
 */

type CreateStreamStateProps<State> = {
  defaultState: State;
  reducers: ReducerFunction<State>;
  routines: (action$: Subject<any>) => Routine<State>[];
};

export const createStreamState = <State>() => ({
  defaultState,
  reducers,
  routines,
}: CreateStreamStateProps<State>) => {
  merge(...routines(action$)).subscribe(action$);
  const stream$ = action$.pipe(
    startWith(defaultState),
    scan<any, any>(reducers),
    publishReplay(1),
    refCount()
  );
  return stream$;
};

/*
 *  Util Functions
 */

export const ofType = (
  ...targetTypes: string[]
): MonoTypeOperatorFunction<Action> =>
  filter(({ type }) => targetTypes.includes(type));
