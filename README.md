## Headless AI Vector Search with Supabase Edge Functions

## Set-up

- Apply migrations to your hosted Supabase Project: `supabase db push`
- Expose `docs` schema via API in Supabase Dashboard settings:
  - https://app.supabase.com/project/_/settings/api > API Settings > Exposed schemas
- [Setup](https://github.com/supabase/supabase-vector-embeddings-github-action#use) `supabase-vector-embeddings` GH action in your Knowledge Base repo
- Deploy `vector-search` Edge Function to your hosted Supabase Project: `supabase functions deploy --no-verify-jwt`
- Set your OpenAI key as a secret: `supabase secrets set OPENAI_KEY=sk-xxx`
- Make a query request

```bash
 curl -i --location --request GET 'https://your-project-ref.functions.supabase.co/vector-search?query=What%27s+Supabase%3F'
```

or with [EventSource](https://developer.mozilla.org/en-US/docs/Web/API/EventSource)

```ts
const onSubmit = (e: Event) => {
  e.preventDefault();
  answer.value = "";
  isLoading.value = true;

  const query = new URLSearchParams({ query: inputRef.current!.value });
  const eventSource = new EventSource(
    `https://your-project-ref.functions.supabase.co/vector-search?${query}`
  );

  eventSource.addEventListener("error", (err) => {
    isLoading.value = false;
    console.error(err);
  });
  eventSource.addEventListener("message", (e: MessageEvent) => {
    isLoading.value = false;

    if (e.data === "[DONE]") {
      eventSource.close();
      return;
    }

    const completionResponse: CreateCompletionResponse = JSON.parse(e.data);
    const text = completionResponse.choices[0].text;

    answer.value += text;
  });

  isLoading.value = true;
};
```
