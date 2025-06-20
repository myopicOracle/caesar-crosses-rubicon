const BIN_ID = "68557e9c8561e97a50283fcc"
const API_KEY = "$2a$10$tPl24rZ5BO8f8WHPhcmtReluCVDtXnVFcW3xpWIWUF0X.hnN61lF."

const nowIKnowMyABCs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const alphabet52 = [...nowIKnowMyABCs, ...nowIKnowMyABCs]
const inputBox = document.getElementById("inputBox")
const inputDiv = document.getElementById("input")
const outputDiv = document.getElementById("output")
const encryptBtn = document.getElementById("encryptBtn")

// const messageHistoryContainer = document.createElement("div")
const messageHistoryContainer = document.getElementById("messageHistoryContainer")
messageHistoryContainer.style.border = "2px solid red"
messageHistoryContainer.style.minWidth = "100px"
messageHistoryContainer.style.minHeight = "50px"
messageHistoryContainer.style.backgroundColor = "rgba(255, 0, 0, 0.1)"
// document.body.appendChild(messageHistoryContainer)

const cypherShift = 4

const handleClick = async () => {
  const userInput = inputBox.value
  console.log("userInput: ", userInput)
  const encrypted = useCypher(userInput)
  console.log("encrypted: ", encrypted)

  // inputDiv.textContent = userInput
  outputDiv.textContent = encrypted
  console.log("encrypted: ", encrypted)

  const message = { original: userInput, encrypted: encrypted, cypher: cypherShift }
  console.log("message: ", message)
  await postMessage(message)
  renderMessage(message)
}

const useCypher = (string) => {
  console.log("string: ", string)

  const originalString = string
  const stringToArray = splitString(originalString)
  console.log("stringToArray: ", stringToArray)

  const encryptedArray = stringToArray.map((char) => {

    const charIndex = alphabet52.findIndex((letter) => letter === char.toUpperCase())
    // console.log("charIndex: ", charIndex)

    const shiftedIndex = charIndex + cypherShift
    // console.log("shiftedIndex: ", shiftedIndex)

    const newChar = alphabet52[shiftedIndex]
    // console.log("newChar: ", newChar)

    if (char !== ' ') {
      return newChar
    } else {
      return char
    }
  
  })
  
  const encryptedString = joinArray(encryptedArray)
  console.log("encryptedString: ", encryptedString)
  
  return encryptedString
}

const splitString = (string) => {
  return string.split("")
}

const joinArray = (string) => {
  return string.join("")
}

encryptBtn.addEventListener("click", handleClick)

window.addEventListener("DOMContentLoaded", async () => {
  const messages = await fetchMessages()
  messages.forEach(renderMessage)
})

async function fetchMessages() {
  const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
    headers: {
      'X-Master-Key': API_KEY
    }
  })
  const data = await res.json()
  return data.record.messages || []
}

async function postMessage(newMsg) {
  const currentMessages = await fetchMessages()
  const updated = [...currentMessages, newMsg]

  await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': API_KEY
    },
    body: JSON.stringify({
      record: {
        messages: updated
      }
    })
  })
}

function renderMessage(msg) {
  const wrapper = document.createElement("div")
  wrapper.style.marginBottom = "8px"

  // const originalP = document.createElement("p")
  // originalP.textContent = "Original: " + msg.original

  const encryptedP = document.createElement("p")
  encryptedP.textContent = "Encrypted: " + msg.encrypted

  // wrapper.appendChild(originalP)
  wrapper.appendChild(encryptedP)

  messageHistoryContainer.appendChild(wrapper)
}
