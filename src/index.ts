import { Hono } from 'hono'

const app = new Hono()

app.post('/parse', async (c) => {
  const { text } = await c.req.json()

  const result = {
    name: text.match(/([A-Z][a-z]+\s[A-Z][a-z]+)/)?.[1],
    email: text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/)?.[0],
    phone: text.match(/(\+?\d{1,3}[\s-]?)?\(?\d{2,4}\)?[\s-]?\d{3}[\s-]?\d{3,4}/)?.[0],
    title: text.match(/(?<=\n)[A-Za-z ]+?(?=\n)/)?.[0] || '',
  }

  return c.json({ result })
})

export default app