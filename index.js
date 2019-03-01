const fs = require('fs');
const arrV = [];// Array with vertical photos and shit
const objH = {};// Map with horizontal photos

const file = fs.readFileSync('b_lovely_landscapes.txt', 'utf8').split('\n');
const arr = file.slice(1,file.length-1).forEach((item, index) => {
  const [type, count, ...tags] = item.split(' ');
  tags.sort((a, b) => a.localeCompare(b));
  if (type === 'H'){
    if (!objH[tags.length]) objH[tags.length] = []
    objH[tags.length].push({ [index]: tags })
  }
  else {
    arrV.push([index, tags])
  }
});

arrV.sort((a, b) => a[1].length - b[1].length )


let maxLength = 0;
let currSet = new Set();
let prevSet = new Set();
let firstIndex = 0;
let lastIndex = arrV.length-1;
console.log(arrV)
while (true){
  if (arrV.length - 1) break
  const arr = arrV[firstIndex][1].concat(arrV[lastIndex][1]);
  prevSet = currSet;
  currSet =  new Set(arr);
  maxLength = arr.length;
  if (prevSet.size >= maxLength) {
    if (!objH[prevSet.size]) objH[prevSet.size] = [];
    objH[prevSet.size].push({ [arrV[firstIndex][0] + ' ' + arrV[lastIndex+1][0]]: [...prevSet] })
    arrV.splice(lastIndex+1, 1);
    firstIndex++;
    maxLength = 0;
    currSet = new Set();
    lastIndex = arrV.length-1;
    continue;
  }
  if (firstIndex === lastIndex - 1){
    try {
      if (!objH[currSet.size]) objH[currSet.size] = [];
      objH[currSet.size].push({ [arrV[firstIndex][0] + ' ' + arrV[lastIndex+1][0]]: [...currSet]})
    }catch (e) {

    }
    break;
  };
  lastIndex--;
};

const photos = [];
Object.keys(objH).forEach((item) => {
  photos.push(...objH[item].map(photo => [Object.keys(photo)[0], Object.values(photo)[0]]))
});

console.log(photos)

prevSet = new Set();

currSet = new Set();
let modulePrev = 0;
let moduleCurr = 0;
lastIndex = photos.length-1;
firstIndex = lastIndex-1;
const result = [photos[lastIndex][0]];
while (firstIndex !== -1){
  const arr = photos[firstIndex][1].concat(photos[lastIndex][1]);
  prevSet = currSet;
  modulePrev = moduleCurr;
  currSet =  new Set(arr);
  if (Math.floor(arrV[firstIndex][1].length/2) <= prevSet.size || modulePrev === 0 ) {
    result.push(arrV[firstIndex][0])
    const newLast = photos.splice(firstIndex, 1);
    photos.pop()
    photos.push(newLast);
    lastIndex = photos.length-1;
    firstIndex = lastIndex-1;
    prevSet = new Set();
    currSet = new Set();
    continue;
  };
  moduleCurr = Math.abs(Math.floor(arrV[firstIndex][1].length/2) - currSet.size);
  firstIndex--;
}

fs.writeFileSync('outputb.txt', result.length);
for(let i =0; i<result.length; i++){
  let data = "\n" + result[i];
  fs.appendFileSync('outputb.txt', data);
}
