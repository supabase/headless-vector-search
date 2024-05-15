## Headless Vector Search

Provides a vector/similarity search for any documentation site. It's [headless](https://en.wikipedia.org/wiki/Headless_software), so that you can integrate it into your existing website.

#### How it works:

- This repo initializes a new `docs` schema inside your database.
- The accompanying [GitHub Action](https://github.com/supabase/supabase-vector-embeddings-github-action) ingests your markdown docs into your database as embeddings.
- This repo provides an Edge Function that handles user queries, converting them into ChatGPT-like responses.

#### Tech stack:

- Supabase: Database & Edge Functions.
- OpenAI: Embeddings and completions.
- GitHub Actions: for ingesting your markdown docs.

## Set-up

Start by creating a new Supabase Project: [database.new](https://database.new).

1. Clone this repo 
2. Link the repo to your remote project: `supabase link --project-ref XXX`
3. Apply the database migrations: `supabase db push`
4. Set your OpenAI key as a secret: `supabase secrets set OPENAI_API_KEY=sk-xxx`
5. Deploy the Edge Functions: `supabase functions deploy --no-verify-jwt`
6. Expose `docs` schema via API in Supabase Dashboard [settings](https://app.supabase.com/project/_/settings/api) > `API Settings` > `Exposed schemas`
7. [Setup](https://github.com/supabase/supabase-vector-embeddings-github-action#use) `supabase-vector-embeddings` GitHub action in your Knowledge Base repo. You will see the embeddings populated in your database after the GitHub Action has run.

## Usage

1. Find the URL for the `vector-search` Edge Function in the [Functions section](https://app.supabase.com/project/_/functions) of the Dashboard.
2. Inside your appliction, you can send the user queries to this endpoint to receive a streamed response from OpenAI.

<details>
 <summary>See cURL example</summary>

```bash
 curl -i --location --request GET 'https://your-project-ref.functions.supabase.co/vector-search?query=What%27s+Supabase%3F'
```

</details>

<details>
 <summary>See <a href="https://developer.mozilla.org/en-US/docs/Web/API/EventSource">EventSource</a> example</summary>


```ts
const onSubmit = (e: Event) => {
  e.preventDefault()
  answer.value = ""
  isLoading.value = true

  const query = new URLSearchParams({ query: inputRef.current!.value })
  const projectUrl = `https://your-project-ref.functions.supabase.co`
  const queryURL = `${projectURL}/${query}`
  const eventSource = new EventSource(queryURL)

  eventSource.addEventListener("error", (err) => {
    isLoading.value = false
    console.error(err)
  })
  
  eventSource.addEventListener("message", (e: MessageEvent) => {
    isLoading.value = false

    if (e.data === "[DONE]") {
      eventSource.close()
      return
    }

    const completionResponse: CreateCompletionResponse = JSON.parse(e.data)
    const text = completionResponse.choices[0].text

    answer.value += text
  });

  isLoading.value = true
}
```

</details>


## Showcase

- [docs.supabase.com](https://supabase.com/docs) - Use <kbd>cmd+k</kbd> to access.

## License

MIT
