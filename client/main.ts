import { createClient } from 'npm:redis';
import { RedisClientType } from 'npm:redis/client';

type TestMessage = { index: number; timestamp: number; counter: number };

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const processMessage = async (redis: RedisClientType, message: TestMessage) => {
  if (message.counter > 0) {
    await sleep(1000);
    redis.rPush(
      'test-message',
      JSON.stringify({ ...message, counter: message.counter - 1 })
    );
  } else {
    console.log({ message, time: Date.now() - message.timestamp });
  }
};

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const redis = createClient({
    url: 'redis://localhost:6379',
  });
  await redis.connect();
  while (true) {
    const payload = await redis.blPop('test-message', 0);
    if (!payload) continue;
    const message: TestMessage = JSON.parse(payload.element);
    processMessage(redis, message);
  }
}
