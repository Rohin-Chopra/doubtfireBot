const state = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  confirm_password: '',
  student_password: ''
}

const isEmpty = (val) => val === ''

const validatePassword = (val) => val.length > 7

const validateConfirmPassword = (val) => state.password === val

const validateStudentId = (val) => {
  const regex = /^\d{9}$/
  return regex.test(val)
}

const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}
const validate = {
  first_name: (val) => (isEmpty(val) ? 'First name cannot be empty' : ''),
  last_name: (val) => (isEmpty(val) ? 'Last name cannot be empty' : ''),
  email: (val) => (!validateEmail(val) ? 'Invalid email' : ''),
  password: (val) =>
    !validatePassword(val) ? 'Password should be at least 8 characters' : '',
  confirm_password: (val) =>
    !validateConfirmPassword(val) ? 'Passwords dont match' : '',
  id: (val) => (!validateStudentId(val) ? 'Invalid Student Id' : ''),
  student_password: (val) =>
    isEmpty(val) ? 'Doubtfire password cannot be empty' : ''
}

const inputs = Array.from(
  document.getElementById('sign-up-form').getElementsByTagName('input')
)

inputs.forEach((input) => {
  input.addEventListener('input', (e) => {
    state[e.target.name] = e.target.value
    console.log(e.target.name, e.target.value)
    const error = validate[e.target.name](e.target.value)
    if (error !== '') {
      e.target.classList.add('error')
      console.log(`${e.target.name}_error`)
      const errorLabel = document.getElementById(`${e.target.name}_error`)
      errorLabel.textContent = error
      errorLabel.classList.remove('hidden')
    } else {
      e.target.classList.remove('error')
      const errorLabel = document.getElementById(`${e.target.name}_error`)
      errorLabel.textContent = error
      errorLabel.classList.add('hidden')
    }
  })
})

const validateForm = () => {
  let isValid = true
  inputs.forEach((input) => {
    const error = validate[input.name](input.value)
    if (error !== '') {
      input.classList.add('error')
      const errorLabel = document.getElementById(`${input.name}_error`)
      errorLabel.textContent = error
      errorLabel.classList.remove('hidden')
      isValid = false
    } else {
      input.classList.remove('error')
      const errorLabel = document.getElementById(`${input.name}_error`)
      errorLabel.textContent = error
      errorLabel.classList.add('hidden')
    }
  })
  return isValid
}

const signUp = async () => {
  const snackbar = document.querySelector('#snackbar')
  const loader = document.querySelector('#form-loader')

  loader.classList.remove('hidden')
  const response = await fetch('http://localhost:5000/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(state)
  })

  const data = await response.json()
  if (response.status === 200) {
    snackbar.classList.add('bg-green-500')
    snackbar.textContent = 'Success : '
  } else {
    snackbar.classList.add('bg-red-500')
    snackbar.textContent = 'Error : '
  }
  snackbar.textContent += data.message
  snackbar.classList.add('show')
  loader.classList.add('hidden')

  setTimeout(() => {
    snackbar.classList.remove('show')
  }, 3000)
}

const submitForm = (e) => {
  e.preventDefault()
  if (!validateForm()) {
    console.log('it is not valid')
    return false
  }
  console.log('it is  valid')

  signUp()
  return false
}

// TODO: extract common part from validate method
document.getElementById('sign-up-form').onsubmit = submitForm
