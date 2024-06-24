let blockSizes = [];
let processSizes = [];

function validateInput(value, minValue, maxValue) {
    if (isNaN(value) || value < minValue || value > maxValue) {
        alert(`Value must be between ${minValue} to ${maxValue}.`);
        return false;
    }
    return true;
}

function addBlocks() {
    const blockNum = parseInt(document.getElementById('block-num').value);
    if (!validateInput(blockNum, 1, 10)) return;

    blockSizes = [];
    const blockSizesContainer = document.getElementById('block-sizes');
    blockSizesContainer.innerHTML = '';
    for (let i = 0; i < blockNum; i++) {
        let size = parseInt(prompt(`Enter size of block ${i + 1}`));
        if (!validateInput(size, 1, Infinity)) return;
        blockSizes.push(size);
        blockSizesContainer.innerHTML += `<p>Block ${i + 1} Size: ${size}</p>`;
    }
    blockSizesContainer.classList.remove('hidden');
}

function addProcesses() {
    const processNum = parseInt(document.getElementById('process-num').value);
    if (!validateInput(processNum, 1, 15)) return;

    processSizes = [];
    const processSizesContainer = document.getElementById('process-sizes');
    processSizesContainer.innerHTML = '';
    for (let i = 0; i < processNum; i++) {
        let size = parseInt(prompt(`Enter size of process ${i + 1}`));
        if (!validateInput(size, 1, Infinity)) return;
        processSizes.push(size);
        processSizesContainer.innerHTML += `<p>Process ${i + 1} Size: ${size}</p>`;
    }
    processSizesContainer.classList.remove('hidden');
}


function printResults(outputDiv, allocation, totalSpaceLeft, smallestHoleSize, largestHoleSize) {
    outputDiv.innerHTML += '<p>Process No. &emsp; Process Size &emsp; Block no.</p>';
    let c = 0;
    for (let i = 0; i < allocation.length; i++) {
        outputDiv.innerHTML += `<p>${i + 1} &emsp;&emsp;&emsp;&emsp;&emsp;&emsp; ${processSizes[i]} &emsp;&emsp;&emsp;&emsp;&emsp;&emsp; ${allocation[i] === -1 ? 'Not Allocated' : allocation[i] + 1}</p>`;
        if (allocation[i] !== -1) {
            c++;
        }
    }
    outputDiv.innerHTML += `<p>Total Space Left: ${totalSpaceLeft}</p>`;
    outputDiv.innerHTML += `<p>Smallest hole Size: ${smallestHoleSize}</p>`;
    outputDiv.innerHTML += `<p>Largest hole Size: ${largestHoleSize}</p>`;
    return c;
}

const allocation = new Array(processSizes.length).fill(-1);

function firstFit(blockSizes, processSizes) {
    let totalSpaceLeft = blockSizes.reduce((acc, val) => acc + val, 0);
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML += '<h2>First Fit</h2>';
    let smallestHoleSize = Infinity;
    let largestHoleSize = -Infinity;

    for (let i = 0; i < processSizes.length; i++) {
        let firstInd = -1;
        for (let j = 0; j < blockSizes.length; j++) {
            if (blockSizes[j] >= processSizes[i]) {
                allocation[i] = j;
                firstInd = j;
                blockSizes[j] -= processSizes[i];
                totalSpaceLeft -= processSizes[i];
                smallestHoleSize = Math.min(smallestHoleSize, blockSizes[j]);
                break;
            }
        }
        if(firstInd == -1){
            allocation[i] = -1;
        }

    }
    smallestHoleSize = Math.min(...blockSizes);
    largestHoleSize = Math.max(...blockSizes);


    const allocatedProcessesCount = printResults(outputDiv, allocation, totalSpaceLeft, smallestHoleSize, largestHoleSize);
    return [allocatedProcessesCount, smallestHoleSize, largestHoleSize, totalSpaceLeft];
}

function bestFit(blockSizes, processSizes) {
    const allocation = new Array(processSizes.length).fill(-1);
    let totalSpaceLeft = blockSizes.reduce((acc, val) => acc + val, 0);
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML += '<h2>Best Fit</h2>';
    let smallestHoleSize = Infinity;
    let largestHoleSize = -Infinity;

    for (let i = 0; i < processSizes.length; i++) {
        let bestInd = -1;
        let sbestInd=-1;
        for (let j = 0; j < blockSizes.length; j++) {
            if (blockSizes[j] >= processSizes[i]) {
                if (bestInd === -1 || blockSizes[bestInd] > blockSizes[j]) {
                    bestInd = j;
                }
            }
        }
        for (let j = 0; j < blockSizes.length; j++) {
            if (blockSizes[j] >= processSizes[i] && j!=bestInd) {
                if (sbestInd === -1 || blockSizes[sbestInd] > blockSizes[j]) {
                    sbestInd = j;
                }
            }
        }
        if (sbestInd !== -1) {
            allocation[i] = sbestInd;
            blockSizes[sbestInd] -= processSizes[i];
            totalSpaceLeft -= processSizes[i];
        }
    }
    smallestHoleSize = Math.min(...blockSizes);
    largestHoleSize = Math.max(...blockSizes);

    const allocatedProcessesCount = printResults(outputDiv, allocation, totalSpaceLeft, smallestHoleSize, largestHoleSize);
    return [allocatedProcessesCount, smallestHoleSize, largestHoleSize, totalSpaceLeft];
}

function worstFit(blockSizes, processSizes) {
    const allocation = new Array(processSizes.length).fill(-1);
    let totalSpaceLeft = blockSizes.reduce((acc, val) => acc + val, 0);
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML += '<h2>Worst Fit</h2>';
    let smallestHoleSize = Infinity;
    let largestHoleSize = -Infinity;

    for (let i = 0; i < processSizes.length; i++) {
        let worstInd = -1;
        for (let j = 0; j < blockSizes.length; j++) {
            if (blockSizes[j] >= processSizes[i]) {
                if (worstInd === -1 || blockSizes[worstInd] < blockSizes[j]) {
                    worstInd = j;
                }
            }
        }
        if (worstInd !== -1) {
            allocation[i] = worstInd;
            blockSizes[worstInd] -= processSizes[i];
            totalSpaceLeft -= processSizes[i];
        }
    }
    smallestHoleSize = Math.min(...blockSizes);
    largestHoleSize = Math.max(...blockSizes);

    const allocatedProcessesCount = printResults(outputDiv, allocation, totalSpaceLeft, smallestHoleSize, largestHoleSize);
    return [allocatedProcessesCount, smallestHoleSize, largestHoleSize, totalSpaceLeft];
}

function nextFit(blockSizes, processSizes) {
    const allocation = new Array(processSizes.length).fill(-1);
    let totalSpaceLeft = blockSizes.reduce((acc, val) => acc + val, 0);
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML += '<h2>Next Fit</h2>';
    let smallestHoleSize = Infinity;
    let largestHoleSize = -Infinity;

    let j = 0;
    for (let i = 0; i < processSizes.length; i++) {
        let k = j;
        let found = false;
        while (!found) {
            if (blockSizes[j] >= processSizes[i]) {
                allocation[i] = j;
                blockSizes[j] -= processSizes[i];
                totalSpaceLeft -= processSizes[i];
                break;
            }
            j = (j + 1) % blockSizes.length;
            if(j === k){
                break;
            }
        }
    }
    smallestHoleSize = Math.min(...blockSizes);
    largestHoleSize = Math.max(...blockSizes);

    const allocatedProcessesCount = printResults(outputDiv, allocation, totalSpaceLeft, smallestHoleSize, largestHoleSize);
    return [allocatedProcessesCount, smallestHoleSize, largestHoleSize, totalSpaceLeft];
}


function allocateMemory() {
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = '';
    console.log("done 1")
    const [allocatedProcessesFirst, smallestHoleSizeFirst, largestHoleSizeFirst, totalSpaceLeftFirst] = firstFit([...blockSizes], [...processSizes]);
    console.log("ff done")
    const [allocatedProcessesBest, smallestHoleSizeBest, largestHoleSizeBest, totalSpaceLeftBest] = bestFit([...blockSizes], [...processSizes]);
    console.log("bf done")
    const [allocatedProcessesWorst, smallestHoleSizeWorst, largestHoleSizeWorst, totalSpaceLeftWorst] = worstFit([...blockSizes], [...processSizes]);
    console.log("wf done")
    const [allocatedProcessesNext, smallestHoleSizeNext, largestHoleSizeNext, totalSpaceLeftNext] = nextFit([...blockSizes], [...processSizes]);
    console.log("done 2")
    let bestFitAlgorithm = '';
    let bestFitAlgorithmScore = 0;
    let unallocatedProcesses = [];
    if (allocatedProcessesFirst < processSizes.length) unallocatedProcesses.push('First Fit');
    if (allocatedProcessesBest < processSizes.length) unallocatedProcesses.push('Best Fit');
    if (allocatedProcessesWorst < processSizes.length) unallocatedProcesses.push('Worst Fit');
    if (allocatedProcessesNext < processSizes.length) unallocatedProcesses.push('Next Fit');
    console.log("done 3")
    if (unallocatedProcesses.length === 4) {
        outputDiv.innerHTML += 'No algorithm could allocate space for any process.';
    } else {
        if (allocatedProcessesFirst > allocatedProcessesBest && smallestHoleSizeFirst < smallestHoleSizeBest && totalSpaceLeftFirst > totalSpaceLeftBest) {
            bestFitAlgorithm = 'First Fit';
            bestFitAlgorithmScore++;
        }
        if (allocatedProcessesFirst > allocatedProcessesWorst && smallestHoleSizeFirst < smallestHoleSizeWorst && totalSpaceLeftFirst > totalSpaceLeftWorst) {
            bestFitAlgorithm = 'First Fit';
            bestFitAlgorithmScore++;
        }
        if (allocatedProcessesBest > allocatedProcessesWorst && smallestHoleSizeBest < smallestHoleSizeWorst && totalSpaceLeftBest > totalSpaceLeftWorst) {
            bestFitAlgorithm = 'Best Fit';
            bestFitAlgorithmScore++;
        }
        if (allocatedProcessesNext > allocatedProcessesWorst && smallestHoleSizeNext < smallestHoleSizeWorst && totalSpaceLeftNext > totalSpaceLeftWorst) {
            bestFitAlgorithm = 'Next Fit';
            bestFitAlgorithmScore++;
        }

        if (bestFitAlgorithmScore === 0) {
            outputDiv.innerHTML += 'The best fit algorithm is suitable for the given situation.';
        } else {
            outputDiv.innerHTML += `The best fit algorithm for the given situation is ${bestFitAlgorithm}.`;
        }

        if (unallocatedProcesses.length > 0) {
            outputDiv.innerHTML += `<p>The following processes could not be allocated space in memory using ${unallocatedProcesses.join(', ')}.</p>`;
        }
    }
}
