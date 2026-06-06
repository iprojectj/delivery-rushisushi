import { createFileRoute } from '@tanstack/react-router'
import InstagramPreSell from '../components/InstagramPreSell'

export const Route = createFileRoute('/instagram')({
  component: InstagramPreSell,
})
