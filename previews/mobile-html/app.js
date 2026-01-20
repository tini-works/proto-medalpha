const initSegments = () => {
  const buttons = document.querySelectorAll('[data-segment-group][data-segment-value]')
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const group = button.dataset.segmentGroup
      const value = button.dataset.segmentValue
      document.querySelectorAll(`[data-segment-group="${group}"]`).forEach((btn) => {
        btn.classList.toggle('is-active', btn === button)
      })
      document.querySelectorAll(`[data-segment-panel="${group}"]`).forEach((panel) => {
        panel.classList.toggle('is-active', panel.dataset.segmentValue === value)
      })
    })
  })
}

const initAccordions = () => {
  document.querySelectorAll('[data-accordion] .accordion-item').forEach((item) => {
    const trigger = item.querySelector('[data-accordion-trigger]')
    if (!trigger) return
    trigger.addEventListener('click', () => {
      item.classList.toggle('is-open')
    })
  })
}

const initToggles = () => {
  document.querySelectorAll('[data-toggle]')?.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('is-on')
      toggle.setAttribute('aria-checked', toggle.classList.contains('is-on') ? 'true' : 'false')
    })
  })
}

const initSelectGroups = () => {
  document.querySelectorAll('[data-select-group]').forEach((group) => {
    const items = group.querySelectorAll('[data-select-item]')
    items.forEach((item) => {
      item.addEventListener('click', () => {
        items.forEach((btn) => btn.classList.remove('is-selected'))
        item.classList.add('is-selected')
      })
    })
  })
}

const initTabs = () => {
  const active = document.body.dataset.tab
  if (!active) return
  document.querySelectorAll('[data-tab-item]').forEach((item) => {
    item.classList.toggle('is-active', item.dataset.tabItem === active)
  })
}

const init = () => {
  initSegments()
  initAccordions()
  initToggles()
  initSelectGroups()
  initTabs()
}

document.addEventListener('DOMContentLoaded', init)
