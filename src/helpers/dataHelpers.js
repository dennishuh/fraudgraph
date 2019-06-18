export const convertToBarGraph = arr => [...arr].sort(sortByDate).map(data => ({ x: data.date, y: data.cards || data.amount }));

export const sortByDate = (a, b) => {
  if ( a.date < b.date ){
    return -1;
  }
  if ( a.date > b.date ){
    return 1;
  }
  return 0;
}

export const getMin = arr => Math.min( ...arr );

export const onlyNumbers = (arr1, arr2) =>[...arr1, ...arr2].map(obj => obj.y);