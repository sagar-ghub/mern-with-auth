function generateTambolaTicket() {
  const entries = new Array(3)
    .fill(0)
    .map(() => new Array(9).fill(0).map(() => 0));

  function numOfEntries() {
    return entries
      .map((r) => r.filter((c) => c).length)
      .reduce((a, b) => a + b, 0);
  }

  function isCompleted() {
    return numOfEntries() === 15;
  }

  function isRowCompleted(rowIndex) {
    const rowValues = getRowValues(rowIndex);
    return rowValues.filter((r) => r).length === 5;
  }

  function isColCompleted(colIndex) {
    const colValues = getColumnValues(colIndex);
    return colValues.filter((c) => c).length === 3;
  }

  function updateEntry(rowIndex, colIndex, value) {
    entries[rowIndex][colIndex] = value;
  }

  function getColumnValues(colIndex) {
    return entries.map((row) => row[colIndex]);
  }

  function getRowValues(rowIndex) {
    return entries[rowIndex];
  }

  function generate() {
    const numbers = new Array(9)
      .fill(0)
      .map((r, rI) => new Array(10).fill(0).map((c, cI) => rI * 10 + cI + 1));

    getRowValues(0).forEach((c, cIndex) => {
      const randomIndex = Math.floor(Math.random() * numbers[cIndex].length);
      const selectedNumber = numbers[cIndex][randomIndex];

      const randomRow = [0, 1, 2].filter((r) => !isRowCompleted(r));
      const selectedRow =
        randomRow[Math.floor(Math.random() * randomRow.length)] || 0;

      if (!isColCompleted(cIndex) && entries[selectedRow][cIndex] === 0) {
        updateEntry(selectedRow, cIndex, selectedNumber);
        numbers[cIndex].splice(randomIndex, 1);
      }
    });

    function fillRecursively() {
      getColumnValues(0).forEach((r, rIndex) => {
        getRowValues(0).forEach((c, cIndex) => {
          const randomIndex = Math.floor(
            Math.random() * numbers[cIndex].length
          );
          const selectedNumber = numbers[cIndex][randomIndex];

          const setOrNot = Math.random() > 0.5;

          if (
            setOrNot &&
            !isCompleted() &&
            !isRowCompleted(rIndex) &&
            !isColCompleted(cIndex) &&
            entries[rIndex][cIndex] === 0
          ) {
            updateEntry(rIndex, cIndex, selectedNumber);
            numbers[cIndex].splice(randomIndex, 1);
          }
        });
      });

      if (!isCompleted()) {
        fillRecursively();
      } else {
        sort();
      }
    }

    fillRecursively();

    // return entries;
  }

  function sort() {
    let ticket = entries;

    for (var col = 0; col < 9; col++) {
      if (
        ticket[0][col] !== 0 &&
        ticket[1][col] !== 0 &&
        ticket[2][col] !== 0
      ) {
        for (var i = 0; i < 2; i++) {
          for (var j = i + 1; j < 3; j++) {
            if (ticket[i][col] > ticket[j][col]) {
              var temp = ticket[i][col];
              ticket[i][col] = ticket[j][col];
              ticket[j][col] = temp;
            }
          }
        }
      } else if (
        ticket[0][col] !== 0 &&
        ticket[1][col] !== 0 &&
        ticket[2][col] === 0
      ) {
        if (ticket[0][col] > ticket[1][col]) {
          var temp = ticket[0][col];
          ticket[0][col] = ticket[1][col];
          ticket[1][col] = temp;
        }
      } else if (
        ticket[0][col] !== 0 &&
        ticket[1][col] === 0 &&
        ticket[2][col] !== 0
      ) {
        if (ticket[0][col] > ticket[2][col]) {
          var temp = ticket[0][col];
          ticket[0][col] = ticket[2][col];
          ticket[2][col] = temp;
        }
      } else if (
        ticket[0][col] === 0 &&
        ticket[1][col] !== 0 &&
        ticket[2][col] !== 0
      ) {
        if (ticket[1][col] > ticket[2][col]) {
          var temp = ticket[1][col];
          ticket[1][col] = ticket[2][col];
          ticket[2][col] = temp;
        }
      }
    }
  }

  function print() {
    console.log("-------------------------------------------");
    entries.forEach((row) => {
      console.log(
        row
          .map((c) => (c === 0 ? "" : c).toString().padStart(2, " "))
          .join(" | ")
      );
      console.log("-------------------------------------------");
    });
  }

  generate();
  // print();

  //   console.log(entries);
  return entries;
}

//   generateTambolaTicket();

exports.generate = (req, res) => {
  const data = generateTambolaTicket();
  return res.status(200).json({
    data,
  });
};
