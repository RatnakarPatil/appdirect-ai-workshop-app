import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Hero from '../Hero'

describe('Hero', () => {
  it('renders the hero section with title', () => {
    render(<Hero />)
    expect(screen.getByText(/AppDirect India/i)).toBeDefined()
    expect(screen.getByText(/AI Workshop/i)).toBeDefined()
  })

  it('renders CTA buttons', () => {
    render(<Hero />)
    expect(screen.getByText(/Register Now/i)).toBeDefined()
    expect(screen.getByText(/View Sessions/i)).toBeDefined()
  })
})

