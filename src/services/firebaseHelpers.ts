import firebase from 'firebase';

//helper functions
export function convertToArray<T>(items: firebase.database.DataSnapshot): Promise<T[]> {
    return new Promise((resolve) => {
        var returnArr: T[] = [];
        items.forEach(function (childSnapshot) {
            var item = childSnapshot.val();
            item.key = childSnapshot.key;
            returnArr.push(item);
        });
        resolve(returnArr);
    });
};

