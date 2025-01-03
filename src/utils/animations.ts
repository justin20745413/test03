import gsap from 'gsap'

export const fadeIn = (element: string | HTMLElement, duration = 1) => {
  return gsap.from(element, {
    opacity: 0,
    duration
  })
}

export const slideIn = (element: string | HTMLElement, direction = 'left', duration = 1) => {
  const x = direction === 'left' ? -100 : direction === 'right' ? 100 : 0
  const y = direction === 'top' ? -100 : direction === 'bottom' ? 100 : 0

  return gsap.from(element, {
    x,
    y,
    opacity: 0,
    duration
  })
}