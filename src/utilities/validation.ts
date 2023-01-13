export const roomProperty = [
  'positionID',
  'name',
  'guest',
  'bedroom',
  'bed',
  'bath',
  'description',
  'price',
  'hostName',
  'phone',
  'address',
];
export const signProperty = ['passWord', 'name', 'email', 'role'];
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
