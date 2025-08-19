const users = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 17 },
  { name: "Carol", age: 30 }
];

const adultNamesDetails = users
  .filter(user => user.age >= 18)
  .map((user) => ({
    name:user.name,
    age:user.age})); 
console.log(adultNamesDetails);

const adultNames=users.
filter(user=>user.age>=18)
.map((user)=>(user.name));
console.log(adultNames);



