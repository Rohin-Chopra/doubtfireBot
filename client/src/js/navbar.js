window.onscroll = () => {
  const top = window.pageYOffset || document.documentElement.scrollTop
  const navbar = document.querySelector('.navbar')
  if (top > 300) {
    navbar.classList.add('navbar-scrolled')
  } else {
    navbar.classList.remove('navbar-scrolled')
  }
}
