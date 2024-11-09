import { createClient } from 'npm:redis';
// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const client = createClient({
    url: 'redis://localhost:6379',
  });
  await client.connect();
  while (true) {
    const data = await client.blPop('channel', 0);
    if (!data) continue;
    const { element } = data;
    console.log(JSON.parse(element));
  }
}
