import { createClient } from 'npm:redis';

type TestMessage = { index: number; timestamp: number; counter: number };

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const client = createClient({
    url: 'redis://localhost:6379',
  });
  await client.connect();
  while (true) {
    const payload = await client.blPop('test-message', 0);
    if (!payload) continue;
    const message: TestMessage = JSON.parse(payload.element);
    if (message.counter <= 0) {
      console.log(message);
      continue;
    }
    setTimeout(() => {
      client.rPush(
        'test-message',
        JSON.stringify({ ...message, counter: message.counter - 1 })
      );
    }, 1000);
  }
}
