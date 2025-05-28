// Fields Style
const fieldInputs = document.querySelectorAll('input[type="text"]')

function handleFocus (e) {
    const field = e.target.closest('.field')
    if (field) {
        field.classList.toggle('input-focused')
    }
}
fieldInputs.forEach(input => {
    input.addEventListener('focus', handleFocus)
    input.addEventListener('blur', handleFocus)
})


// Fields
const billInput = document.getElementById('bill')
const peopleInput = document.getElementById('people')
const customTipInput = document.getElementById('customTip')

// Errors
const billError = document.getElementById('bill-error')
const peopleError = document.getElementById('people-error')
const tipError = document.getElementById('tip-error')

// Validations
const validations = {
    billInput: (value) => parseFloat(value) > 0 ? parseFloat(value) : null, 
    peopleInput: (value) => parseInt(value) > 0 ? parseInt(value) : null,
    customTipInput: (value) => parseInt(value) >= 0 ?parseInt(value) : null
}

// Render Error
const renderError = (error, message) => {
    error.textContent = message
}

// Clear Error
const clearError = () => {
    billError.textContent = ''
    tipError.textContent = ''
    peopleError.textContent = ''
}

let selectedTip = null

function calculate() {
    clearError()

    const bill = validations.billInput(billInput.value)
    const people = validations.peopleInput(peopleInput.value)
    const tip = selectedTip !== null ? selectedTip : validations.customTipInput(customTip.value)

    if (!bill) {
        renderError(billError, "Can't be zero")
    }
    if (tip === null) {
        renderError(tipError, "Tip % is required")
    }
    if (!people) {
        renderError(peopleError, "Can't be zero")
    }

    if (bill && people && tip !== null) {
        const partialTip = (bill * tip) / 100
        const totalTip = partialTip / people
        const totalAmount = (bill + partialTip) / people

        function truncate(num) {
            return Math.floor(num * 100) /100
        }
    
        document.getElementById('totalTip').textContent = `$${truncate(totalTip).toFixed(2)}`
        document.getElementById('totalAmount').textContent = `$${truncate(totalAmount).toFixed(2)}`
    }
}

// Event Listeners
billInput.addEventListener('input', calculate)
peopleInput.addEventListener('input', calculate)

// Event listener for the predefined tips
const tipButtons = document.querySelectorAll('.tip-button')
tipButtons.forEach(button => {
    button.addEventListener('click', () => {
        customTip.value = ''

        selectedTip = parseInt(button.value.replace('%', ''))

        tipButtons.forEach(btn => btn.classList.remove('selected'))
        button.classList.add('selected')

        calculate()
    })
})

// Event listener for custom tip
customTip.addEventListener('input', () => {
    tipButtons.forEach(btn => btn.classList.remove('selected'))

    const customValue = parseInt(customTip.value)
    selectedTip = isNaN(customValue) || customValue < 0 ? null : customValue

    calculate()
})

// Reset
const resetButton = document.querySelector('#reset')
const inputs = [billInput, peopleInput, customTipInput]

inputs.forEach(input => {
    input.addEventListener('input', () => {
        resetButton.disabled = !inputs.some(input => input.value)
    })
})

resetButton.addEventListener('click', () => {

    inputs.forEach(input => {
        input.value = ''
    })

    tipButtons.forEach(button => {
        button.classList.remove('selected')
    })

    document.getElementById('totalTip').textContent = '$0.00'
    document.getElementById('totalAmount').textContent = '$0.00'

    resetButton.disabled = true;
})