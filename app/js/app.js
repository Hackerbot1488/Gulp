document.body.addEventListener('click', () => {
  let color = ''
  document.body.style['background-color'] === 'black'
    ? color = 'pink'
    : color = 'black'
  document.body.style['background-color'] = color
})