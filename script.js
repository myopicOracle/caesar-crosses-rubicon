const alphabet26 = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
const alphabet52 = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
const inputDiv = document.getElementById("input")
const outputDiv = document.getElementById("output")

let testString = "I shall cross the Rubicon by mid-night."
const cypherShift = 4

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


inputDiv.textContent = testString
outputDiv.textContent = useCypher(testString)


console.log("useCypher: ", useCypher(testString))
