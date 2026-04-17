async function* generateUserEvents(total) {
  let id = 1;

  while (id <= total) {
    await new Promise(r => setTimeout(r, 1));

    yield {
      userId: id,
      action: Math.random() > 0.5 ? "click" : "view",
      amount: Math.random() * 500,
      createdAt: Date.now(),
    };

    id++;
  }
}

async function main() {
  const stream = generateUserEvents(1_000_000);

  let processed = 0;
  let totalClickAmount = 0;

  for await (const event of stream) {
    try {
      if (event.action === "click") {
        totalClickAmount += event.amount;
      }

      processed++;

      if (processed % 10000 === 0) {
        console.log(`Processed ${processed} events`);
      }
    } catch (err) {
      console.error("Failed to process event:", err);
    }
  }

  console.log("Finished processing");
  console.log("Total click amount:", totalClickAmount.toFixed(2));
}

main();