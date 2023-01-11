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
export function dataRequire(object: Object, property: Array<string>): boolean {
  for (let index = 0; index < property.length; index++) {
    const element = property[index];
    if (!object.hasOwnProperty(element)) {
      return false;
    }
  }
  return true;
}
