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

const rupiahFormat = ( val) => {
  let number = val.toString().replace(/[^,\d]/g, ''),
  split = number.split(','),
  sisa = split[0].length % 3,
  rupiah = split[0].slice(0, sisa),
  ribuan = split[0].slice(sisa).match(/\d{3}/g);

  if(ribuan){
    let separator = sisa ? '.' : '';
    rupiah += separator + ribuan.join('.')
  }

  return rupiah
}

export {
  capitalize,
  rupiahFormat
}