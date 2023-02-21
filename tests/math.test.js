const {add,calculateTip,fahrenheitToCelsius,celsiusToFahrenheit}=require('../src/math');

test('Should add two numbers',(done)=>{
    add(2,5).then((sum)=>{
        expect(sum).toBe(7);
        done();
    })
})

// we can use this method also where we define a async function and we can use awiat in there and jest will wait for the completion of the code
test('Should add two numbers aync/await',async()=>{
    const sum=await add(2,5);
    expect(sum).toBe(7);
})

// test('Asyc test demo',(done)=>{
//     setTimeout(()=>{
//         expect(1).toBe(2);
//         done();//same like next tells jest that we have asychronus code 
//     },2000);
// })

test ('Should calculate total with tip',()=>{
    const total=calculateTip(10,.3);
    expect(total).toBe(13);
})

test('should calculate total with default tip',()=>{
    const total =calculateTip(10);
    expect(total).toBe(12.5);
})

test('Celsius to fahrenheit',()=>{
    const temp=celsiusToFahrenheit(0);
    expect(temp).toBe(32);
})

test('fagrenheit',()=>{
    const temp=fahrenheitToCelsius(32);
    expect(parseInt(temp)).toBe(0);
})