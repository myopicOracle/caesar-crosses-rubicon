const BIN_ID = "6855da028a456b7966b24740"
const API_KEY = "$2a$10$tPl24rZ5BO8f8WHPhcmtReluCVDtXnVFcW3xpWIWUF0X.hnN61lF."

const nowIKnowMyABCs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const alphabet52 = [...nowIKnowMyABCs, ...nowIKnowMyABCs]
const inputBox = document.getElementById("inputBox")
const inputDiv = document.getElementById("input")
const outputDiv = document.getElementById("output")
const encryptBtn = document.getElementById("encryptBtn")

const messageHistoryContainer = document.getElementById("messageHistoryContainer")

////////////////////////////////////////////////// 
const cypherShift = 4
////////////////////////////////////////////////// 

const handleClick = async () => {
  const userInput = inputBox.value.trim()
  if (!userInput) return

  console.log("userInput: ", userInput)
  const encrypted = useCypher(userInput)
  console.log("encrypted: ", encrypted)

  // inputDiv.textContent = userInput
  outputDiv.textContent = encrypted
  console.log("encrypted: ", encrypted)

  const message = { 
    original: userInput, 
    encrypted: encrypted, 
    cypher: cypherShift,
    timestamp: new Date().toLocaleString() // Add this line
  }

  console.log("message: ", message)
  
  await postMessage(message)
  renderMessage(message)

  inputBox.value = ''
  inputBox.focus()  
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
  // renderMessage({ encrypted: "TEST123", original: "TEST123", cypher: 4 })
  const messages = await fetchMessages()
  console.log("Page loaded. Fetched messages:", messages)
  messages.forEach(renderMessage)
})

async function fetchMessages() {
  const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
    headers: {
      'X-Master-Key': API_KEY
    }
  })
  const data = await res.json()
  console.log("Fetched from JSONBin:", data)
  return data.record.messages || []
}

// Fixed with help of AI: previously overwriting instead of appending
async function postMessage(newMsg) {
  try {
    // First, get the current state of the bin
    const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers: { 'X-Master-Key': API_KEY }
    });
    const data = await res.json();
    
    // Get the current messages array or initialize it if it doesn't exist
    const currentMessages = data.record?.messages || [];
    
    // Add the new message
    const updated = [...currentMessages, newMsg];
    
    // Update the bin with the new array
    const updateRes = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': API_KEY,
        'X-Bin-Versioning': 'false' // This ensures we're not creating new versions
      },
      body: JSON.stringify({
        messages: updated
      })
    });
    
    const result = await updateRes.json();
    console.log('Update result:', result);
    return result;
  } catch (error) {
    console.error('Error in postMessage:', error);
    throw error;
  }
}

// check if DOM element exists
if (!messageHistoryContainer) {
  console.error("messageHistoryContainer not found!")
}

// **AI Generated**
function renderMessage(msg) {
  const wrapper = document.createElement("div");
  wrapper.style.marginBottom = "16px";
  wrapper.style.padding = "12px";
  wrapper.style.border = "1px solid #eee";
  wrapper.style.borderRadius = "4px";

  // Encrypted message display
  const encryptedP = document.createElement("p");
  encryptedP.textContent = "🔒 " + msg.encrypted;
  wrapper.appendChild(encryptedP);

  // Decryption UI
  const decryptContainer = document.createElement("div");
  decryptContainer.className = "decrypt-container";

  // Add password input for shift value
  const input = document.createElement("input");
  input.type = "password";  // Using password type to hide the shift value
  input.className = "decrypt-input";
  input.placeholder = "Enter shift #";
  input.min = "1";
  input.max = "25";

  const decryptBtn = document.createElement("button");
  decryptBtn.className = "decrypt-btn";
  decryptBtn.textContent = "Decrypt";

  const resultDiv = document.createElement("div");
  resultDiv.className = "decrypted-message";

  decryptBtn.addEventListener("click", () => {
      const shift = parseInt(input.value);
      if (shift === cypherShift) {
          resultDiv.textContent = `🔓 ${msg.original || "No original message found"}`;
          resultDiv.style.display = "block";
      } else {
          resultDiv.textContent = "Incorrect shift value!";
          resultDiv.style.display = "block";
          resultDiv.style.borderLeftColor = "#f44336";
      }
  });

  // Add input and button to container
  decryptContainer.appendChild(input);
  decryptContainer.appendChild(decryptBtn);
  
  // Add everything to the wrapper
  wrapper.appendChild(decryptContainer);

    // Add timestamp
  const timestampP = document.createElement("div");
  timestampP.textContent = `🕒 ${msg.timestamp || 'Just now'}`;
  timestampP.style.fontSize = '0.8em';
  timestampP.style.color = '#888';
  timestampP.style.marginTop = '8px';
  wrapper.appendChild(timestampP);
  wrapper.appendChild(resultDiv);
  
  // Add to message history
  messageHistoryContainer.appendChild(wrapper);
}


// Version 1.0 - NO DECRYPT
// function renderMessage(msg) {
//   const wrapper = document.createElement("div")
//   wrapper.style.marginBottom = "8px"

//   // const originalP = document.createElement("p")
//   // originalP.textContent = "Original: " + msg.original

//   const encryptedP = document.createElement("p")
//   encryptedP.textContent = "Encrypted Message: " + msg.encrypted

//   // wrapper.appendChild(originalP)
//   wrapper.appendChild(encryptedP)

//   messageHistoryContainer.appendChild(wrapper)
// }
