import { Hono } from 'hono'

const app = new Hono()

// Middleware to validate RapidAPI key
app.use('*', async (c, next) => {
  const key = c.req.header('X-RapidAPI-Key')
  if (!key) {
    console.warn('Missing X-RapidAPI-Key')
    return c.json({ error: 'Unauthorized: Missing API key' }, 401)
  }

  // Optionally validate against a known list of keys for testing
  const validKeys = ['test-key-123']
  if (!validKeys.includes(key)) {
    console.warn('Invalid API key:', key)
    return c.json({ error: 'Unauthorized: Invalid API key' }, 403)
  }

  console.log('Received valid API key:', key)
  await next()
})

app.post('/parse', async (c) => {
  const { text } = await c.req.json()
  console.log('Parsing text:', text)

  const result = {
    name: text.match(/([A-Z][a-z]+\s[A-Z][a-z]+)/)?.[1],
    email: text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/)?.[0],
    phone: text.match(/(\+?\d{1,3}[\s-]?)?\(?\d{2,4}\)?[\s-]?\d{3}[\s-]?\d{3,4}/)?.[0],
    title: text.match(/(?<=\n)[A-Za-z ]+?(?=\n)/)?.[0] || '',
  }

  console.log('Parsed result:', result)
  return c.json({ result })
})

export default app