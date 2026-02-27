function* cyclicDayGenerator() {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    let i = 0;
    while (true) {
        yield days[i % days.length];
        i++;
    }
}


function sleep(ms) {
    return new Promise(function(resolve) {
        setTimeout(resolve, ms);
    });
}


async function timeoutIteratorAsync(iterator, timeoutSeconds) {
    let start = Date.now();
    let timeoutMs = timeoutSeconds * 1000;
    let count = 0;

    while (Date.now() - start < timeoutMs) {
        let result = iterator.next();
        let value = result.value;
        count++;
        console.log("Ітерація " + count + ": " + value);
        await sleep(500);
    }

    console.log("\nУсьго ітерацій: " + count);
}

let gen = cyclicDayGenerator();
timeoutIteratorAsync(gen, 5);