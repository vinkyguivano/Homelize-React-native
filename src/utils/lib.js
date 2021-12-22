const capitalize = (word) => {
  if(word){
    let array = word.split(' ')

    const capitalize = array.map((item) => (
     item.charAt(0).toUpperCase() + item.slice(1)
    ))
    
    return capitalize.join('')
  }
  return word
}

export {
  capitalize
}