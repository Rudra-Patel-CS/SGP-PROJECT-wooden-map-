async function testPublic() {
  const res = await fetch('http://localhost:3000/api/products');
  const data = await res.json();
  console.log("Public Products Count:", data.length);
  if (data.length > 0) {
    console.log("First Product:", data[0].name);
  } else {
    console.log("No public products found! This might be an RLS issue.");
  }
}
testPublic();
