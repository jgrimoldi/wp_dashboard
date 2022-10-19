import { useState, useEffect } from 'react'

const calculateRange = (data, rowsPerPage) => {
    const range = []
    const number = Math.ceil(data.length / rowsPerPage);

    for (let i = 1; i <= number; i++) {
        range.push(i);
    }

    return range;
}

const sliceData = (data, page, rowsPerPage) => {
    return data.slice((page - 1) * rowsPerPage, page * rowsPerPage);
}


const useTable = (data, page, rowsPerPage, sortFunction) => {
    const [tableRange, setTableRange] = useState([]);
    const [slice, setSlice] = useState([]);

    useEffect(() => {
        data.sort(sortFunction);

        const range = calculateRange(data, rowsPerPage);
        setTableRange([...range]);

        const slice = sliceData(data, page, rowsPerPage);
        setSlice([...slice]);

    }, [data, setTableRange, page, setSlice, rowsPerPage, sortFunction]);

    return { slice, range: tableRange };
}

export default useTable