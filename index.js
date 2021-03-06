const fs = require('fs');

const files = ['a_example.txt', 'b_lovely_landscapes.txt', 'c_memorable_moments.txt', 'd_pet_pictures.txt', 'e_shiny_selfies.txt']

const solve = (inputFile, outputFile) => {
    const arrV = [];// Array with vertical photos and shit
    const objH = {};// Map with horizontal photos

    const file = fs.readFileSync(inputFile, 'utf8').split('\n');
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
    console.log('arrV', arrV)
    while (true){
        console.log('step')
        console.log(arrV.length - 1)
        if (arrV.length <= 1) break
        const arr = arrV[firstIndex][1].concat(arrV[lastIndex][1]);
        prevSet = currSet;
        currSet =  new Set(arr);
        maxLength = arr.length;
        if (prevSet.size >= maxLength) {
            console.log('A1')
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
            console.log('A2', firstIndex, lastIndex);
            if (!objH[currSet.size]) objH[currSet.size] = [];
            try{
                objH[currSet.size].push({ [arrV[firstIndex][0] + ' ' + arrV[lastIndex+1][0]]: [...currSet]})
            } catch (e) {
                objH[currSet.size].push({ [arrV[firstIndex][0] + ' ' + arrV[lastIndex][0]]: [...currSet]})
            }


            break;
        };
        lastIndex--;
    };

    const photos = [];
    console.log('objH', objH)

    Object.keys(objH).forEach((item) => {
        photos.push(...objH[item].map(photo => [Object.keys(photo)[0], Object.values(photo)[0]]))
    });

    console.log('photos', photos)

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
        if (Math.floor(photos[firstIndex][1].length/2) <= prevSet.size || modulePrev === 0 ) {
            result.push(photos[firstIndex][0])
            const newLast = photos.splice(firstIndex, 1);
            photos.pop()
            photos.push(newLast);
            lastIndex = photos.length-1;
            firstIndex = lastIndex-1;
            prevSet = new Set();
            currSet = new Set();
            continue;
        };
        moduleCurr = Math.abs(Math.floor(photos[firstIndex][1].length/2) - currSet.size);
        firstIndex--;
    }

    fs.writeFileSync(outputFile, result.length);
    for(let i =0; i<result.length; i++){
        let data = "\n" + result[i];
        fs.appendFileSync(outputFile, data);
    }
}


files.forEach((file, index) => {
    solve(file, index + '.txt')
})
