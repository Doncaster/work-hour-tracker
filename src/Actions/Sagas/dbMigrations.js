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

function* switchFromTimestampToJsonTime(uid) {
    const hoursRef = Firebase.database().ref(`${uid}/hours`);
    const hoursSnapshot = yield apply(hoursRef, hoursRef.once, ['value']);
    const hours = hoursSnapshot.val();

    for (let key in hours) {
        hours[key].endTime = new Date(hours[key].endTime).toJSON();
        hours[key].startTime = new Date(hours[key].startTime).toJSON();
    }

    yield apply(hoursRef, hoursRef.set, [hours]);
    hoursRef.off();
}

export default [moveHours, switchFromTimestampToJsonTime];
