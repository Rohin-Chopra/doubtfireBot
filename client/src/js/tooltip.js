window.addEventListener('DOMContentLoaded', () => {
  const hasTooltip = Array.from(document.querySelectorAll('.has-tooltip'))

  hasTooltip.forEach((e) => {
    const tooltip = e.querySelector('.tooltip')
    tooltip.textContent = e.dataset.tooltip
    e.addEventListener('mouseenter', () => {
      tooltip.classList.remove('hidden')
    })
    e.addEventListener('mouseleave', () => {
      tooltip.classList.add('hidden')
    })
  })
})
