export const roomProperty = [
  'hostID',
  'nameRoom',
  'guest',
  'bed',
  'price',
  'hostID',
];
export const hostProperty = [
  'hostName',
  'phone',
  'bath',
  'address',
  'description',
  'positionID',
];
export const positionProperty = ['name', 'city', 'country'];
export const signProperty = ['passWord', 'name', 'email'];
export const loginProperty = ['passWord', 'email'];
export function dataRequire(object: Object, property: Array<string>): boolean {
  for (let index = 0; index < property.length; index++) {
    const element = property[index];

    if (!object.hasOwnProperty(element)) {
      return true;
    }
  }
  return false;
}
export function checkEmpty(object: Object): boolean {
  for (const key in object) {
    if (key === 'role') {
      continue;
    }
    if (!object[key]) {
      return true;
    }
  }
  return false;
}
export const mimetypeImage = ['image/jpg', 'image/png', 'image/jpeg'];
