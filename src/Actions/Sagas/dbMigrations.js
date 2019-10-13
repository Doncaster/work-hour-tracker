import Firebase from 'firebase/app';
import { apply } from 'redux-saga/effects';

function* moveHours(uid) {
    const oldHoursRef = Firebase.database().ref(`hours/${uid}`);
    const newHoursRef = Firebase.database().ref(`${uid}/hours`);

    const oldHoursSnapshot = yield apply(oldHoursRef, oldHoursRef.once, ['value']);
    const oldHours = oldHoursSnapshot.val();

    yield apply(newHoursRef, newHoursRef.set, [oldHours]);
    yield apply(oldHoursRef, oldHoursRef.remove);

    oldHoursRef.off();
    newHoursRef.off();
}

export default [moveHours];
