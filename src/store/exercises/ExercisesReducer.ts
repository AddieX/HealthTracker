import {
    ADD_EXERCISE,
    DELETE_EXERCISE,
    UPDATE_EXERCISE_LATEST_COMPLETED_SETS,
} from './ExercisesActions';
import ExercisesState from './ExercisesState';
import { Exercise } from './models/Exercise';
import { ExerciseSet } from './models/ExerciseSet';

function addExercise(state: ExercisesState, action: Action<Exercise>): ExercisesState {
    const exercise = action.payload;
    if (!exercise || state.map[exercise.name]) {
        return state;
    }

    return {
        ...state,
        map: {
            ...state.map,
            [exercise.name]: {
                ...exercise,
            },
        },
    };
}

function deleteExercise(state: ExercisesState, action: Action<Exercise>): ExercisesState {
    const exercise = action.payload;
    if (!exercise || !state.map[exercise.name]) {
        return state;
    }

    delete state.map[exercise.name];

    return {
        ...state,
        map: {
            ...state.map,
        },
    };
}

function updateLatestCompletedSets(state: ExercisesState, action: Action<{ exercise: Exercise, set: ExerciseSet, setIndex: number }>): ExercisesState {
    const exercise = action.payload?.exercise;
    const set = action.payload?.set;
    const setIndex = action.payload?.setIndex;

    if (!exercise || !set || setIndex === undefined || !state.map[exercise.name]) {
        return state;
    }

    const { latestCompletedSets } = state.map[exercise.name];
    if (set.completed) {
        latestCompletedSets[setIndex] = set;
    } else {
        return state;
    }

    return {
        ...state,
        map: {
            ...state.map,
            [exercise.name]: {
                ...exercise,
                latestCompletedSets,
            },
        },
    };
}

export const EXERCISES_INITIAL_STATE: ExercisesState = {
    map: {},
};

const exercisesReducerMap = {
    [ADD_EXERCISE]: addExercise,
    [DELETE_EXERCISE]: deleteExercise,
    [UPDATE_EXERCISE_LATEST_COMPLETED_SETS]: updateLatestCompletedSets,
};

export function exercisesReducer(state = EXERCISES_INITIAL_STATE, action: Action<any>): ExercisesState {
    const reducer = exercisesReducerMap[action.type];

    if (!reducer) {
        return state;
    }

    return reducer(state, action);
}